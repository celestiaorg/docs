// Release publication order does not establish network compatibility.
const targets = [
  { repo: 'celestia-app', key: 'app' },
  { repo: 'celestia-node', key: 'node' },
];

function parseTag(tag, network) {
  if (!['mainnet', 'mocha'].includes(network)) throw new Error(`Unknown network: ${network}`);
  const suffix = network === 'mocha' ? '-mocha' : '';
  const match = typeof tag === 'string' && tag.match(new RegExp(`^v(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)${suffix}$`));
  if (!match) throw new Error(`Unrecognised ${network} release tag: ${tag}`);
  return { series: `${match[1]}.${match[2]}`, patch: BigInt(match[3]) };
}

function validateSha(sha, tag) {
  if (typeof sha !== 'string' || !/^[a-f0-9]{40}$/.test(sha)) {
    throw new Error(`Invalid commit SHA for ${tag}`);
  }
}

export function selectRelease({ releases, currentTag, series, network }) {
  const current = parseTag(currentTag, network);
  if (series !== current.series) {
    throw new Error(`Approved series ${series} does not match current ${currentTag}; update policy and constants together`);
  }
  let selected = currentTag;
  let selectedPatch = current.patch;
  let currentFound = false;
  const skipped = [];
  for (const release of releases) {
    const tag = release.tag_name;
    if (release.draft || (network === 'mainnet' && release.prerelease)) continue;
    // Namespaced releases belong to separate packages in the upstream repository.
    if (tag?.includes('/')) continue;
    // Other channels and release candidates are not eligible for this network.
    if (network === 'mocha' ? !tag?.endsWith('-mocha') : tag?.includes('-')) continue;
    const version = parseTag(tag, network);
    if (version.series !== series) {
      skipped.push(`${tag}: outside approved series ${series}`);
      continue;
    }
    if (tag === currentTag) currentFound = true;
    if (version.patch < current.patch) {
      skipped.push(`${tag}: older than ${currentTag}`);
    } else if (version.patch > selectedPatch) {
      selected = tag;
      selectedPatch = version.patch;
    }
  }
  if (!currentFound) throw new Error(`Current release ${currentTag} is missing or ineligible`);
  return { tag: selected, skipped };
}

export async function planUpdates({ github, owner, network, current, policy }) {
  const next = { ...current };
  const summary = [];
  for (const { repo, key } of targets) {
    const tagKey = `${key}-latest-tag`;
    const shaKey = `${key}-latest-sha`;
    const currentTag = current?.[tagKey];
    validateSha(current?.[shaKey], currentTag);
    const releases = await github.paginate(github.rest.repos.listReleases, { owner, repo, per_page: 100 });
    const { tag, skipped } = selectRelease({ releases, currentTag, series: policy?.[network]?.[key], network });
    // Check the existing tag too, even when a newer patch is available.
    const { data: existing } = await github.rest.repos.getCommit({ owner, repo, ref: currentTag });
    validateSha(existing.sha, currentTag);
    if (existing.sha !== current[shaKey]) throw new Error(`Commit SHA changed for ${repo}@${currentTag}; manual investigation required`);
    const { data: selected } = tag === currentTag
      ? { data: existing }
      : await github.rest.repos.getCommit({ owner, repo, ref: tag });
    validateSha(selected.sha, tag);
    next[tagKey] = tag;
    next[shaKey] = selected.sha;
    summary.push(`${repo}: ${currentTag} -> ${tag}`, ...skipped.map(reason => `${repo}: skipped ${reason}`));
  }
  return { next, summary, changed: targets.some(({ key }) => current[`${key}-latest-tag`] !== next[`${key}-latest-tag`]) };
}
