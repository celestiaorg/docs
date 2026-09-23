import assert from 'node:assert/strict';
import test from 'node:test';
import { planUpdates, selectRelease } from './latest-tags.mjs';

const release = (tag_name, extra = {}) => ({ tag_name, draft: false, prerelease: false, ...extra });
const select = (tags, extra = {}) => selectRelease({
  releases: tags.map(tag => typeof tag === 'string' ? release(tag) : tag),
  currentTag: 'v9.0.8', series: '9.0', network: 'mainnet', ...extra,
});

test('late historical release cannot downgrade Mainnet (PR #2600)', () => {
  const result = select(['v3.13.0', 'v9.0.8', 'v9.0.6']);
  assert.equal(result.tag, 'v9.0.8');
  assert.ok(result.skipped.some(reason => reason.includes('v3.13.0')));
});

test('selects highest approved patch numerically regardless of API ordering', () => {
  assert.equal(select(['v9.0.9', 'v9.0.8', 'v9.0.11', 'v9.0.10']).tag, 'v9.0.11');
});

test('new major and minor series require explicit approval', () => {
  assert.equal(select(['v10.0.0', 'v9.1.0', 'v9.0.8']).tag, 'v9.0.8');
});

test('Mainnet excludes Mocha, release candidates, drafts and prereleases', () => {
  assert.equal(select(['multiplexer/v0.4.0', 'v9.0.20-mocha', 'v9.0.20-rc.1', release('v9.0.19', { draft: true }),
    release('v9.0.18', { prerelease: true }), 'v9.0.8']).tag, 'v9.0.8');
});

test('Mocha accepts its prerelease patches but excludes other channels', () => {
  assert.equal(select(['v10.2.9', 'v10.2.9-corto', 'v10.3.0-mocha', 'v10.2.0-mocha',
    release('v10.2.1-mocha', { prerelease: true })],
  { currentTag: 'v10.2.0-mocha', series: '10.2', network: 'mocha' }).tag, 'v10.2.1-mocha');
});

test('invalid current tags, missing policy, policy drift and missing release fail closed', () => {
  for (const extra of [{ currentTag: 'garbage' }, { series: undefined }, { series: '10.0' }, { network: 'other' }]) {
    assert.throws(() => select(['v9.0.8'], extra));
  }
  assert.throws(() => select(['v9.0.9']), /missing or ineligible/);
  assert.throws(() => select(['v9.0.8', 'invalid']), /Unrecognised/);
});

const oldSha = 'a'.repeat(40);
const newSha = 'b'.repeat(40);
function fixture({ moved = false, tags = ['v9.0.8'], badSha = false } = {}) {
  return {
    owner: 'celestiaorg', network: 'mainnet',
    current: { 'app-latest-tag': 'v9.0.8', 'app-latest-sha': oldSha,
      'node-latest-tag': 'v0.33.2', 'node-latest-sha': oldSha, preserved: 'value' },
    policy: { mainnet: { app: '9.0', node: '0.33' } },
    github: {
      paginate: async (_method, { repo }) => (repo === 'celestia-app' ? tags : ['v0.33.2']).map(tag => release(tag)),
      rest: { repos: {
        listReleases: () => {},
        getCommit: async ({ ref }) => ({ data: { sha: badSha ? 'bad' : moved || ref === 'v9.0.9' ? newSha : oldSha } }),
      } },
    },
  };
}

test('historical release produces no update and explains the skip', async () => {
  const input = fixture({ tags: ['v3.13.0', 'v9.0.8'] });
  const result = await planUpdates(input);
  assert.equal(result.changed, false);
  assert.deepEqual(result.next, input.current);
  assert.ok(result.summary.some(line => line.includes('skipped v3.13.0')));
});

test('valid patch updates tag and SHA together and preserves other fields', async () => {
  const input = fixture({ tags: ['v9.0.9', 'v9.0.8'] });
  const result = await planUpdates(input);
  assert.equal(result.changed, true);
  assert.equal(result.next['app-latest-tag'], 'v9.0.9');
  assert.equal(result.next['app-latest-sha'], newSha);
  assert.equal(result.next.preserved, 'value');
  assert.equal(input.current['app-latest-tag'], 'v9.0.8');
});

test('retagging fails even when a newer patch exists', async () => {
  for (const tags of [['v9.0.8'], ['v9.0.9', 'v9.0.8']]) {
    await assert.rejects(planUpdates(fixture({ moved: true, tags })), /SHA changed/);
  }
});

test('missing constants, invalid SHAs and API failures cannot produce an update', async () => {
  await assert.rejects(planUpdates({ ...fixture(), current: null }), /Invalid commit SHA/);
  await assert.rejects(planUpdates(fixture({ badSha: true })), /Invalid commit SHA/);
  const input = fixture();
  input.github.paginate = async () => { throw new Error('API unavailable'); };
  await assert.rejects(planUpdates(input), /API unavailable/);
});
