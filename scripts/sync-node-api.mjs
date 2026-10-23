#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// Use the selected network versions, never GitHub's latest release ordering.
export async function syncNodeApi({ root = new URL('../', import.meta.url), fetchImpl = fetch } = {}) {
  const read = (file) => readFile(new URL(file, root), 'utf8');
  const manifestPath = 'constants/node_api_versions.json';
  const original = await read(manifestPath);
  const versions = JSON.parse(original);
  const downloads = new Map();
  const previous = [];

  for (const network of ['mainnet', 'mocha']) {
    const current = JSON.parse(await read(`constants/${network}_versions.json`));
    const tag = current['node-latest-tag'];
    assert.ok(typeof tag === 'string' && (network === 'mainnet'
      ? /^v\d+\.\d+\.\d+$/ : /^v\d+\.\d+\.\d+-mocha$/).test(tag), `Invalid ${network} node tag: ${tag}`);
    const file = `public/specs/openrpc-${tag}.json`;
    let contents;
    try {
      contents = await read(file);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const url = `https://github.com/celestiaorg/celestia-node/releases/download/${tag}/openrpc.json`;
      const response = await fetchImpl(url, { signal: AbortSignal.timeout(60_000) });
      assert.ok(response.ok, `Cannot download ${url}: HTTP ${response.status}`);
      contents = await response.text();
      downloads.set(file, contents);
    }
    const spec = JSON.parse(contents);
    assert.equal(spec.info?.version, tag, `Spec version mismatch: ${tag}`);
    assert.ok(spec.openrpc && Array.isArray(spec.methods) && spec.methods.length
      && spec.methods.every(method => typeof method.name === 'string'), `Invalid OpenRPC spec: ${tag}`);
    if (versions[network] !== tag) previous.push(versions[network]);
    versions[network] = tag;
  }

  // Keep old dropdown entries and URLs; explicit version rollbacks can reuse them.
  versions.historical = [...new Set([...previous, ...versions.historical])]
    .filter(tag => tag !== versions.mainnet && tag !== versions.mocha);
  // Validate every download before writing the assets or advancing the manifest.
  for (const [file, contents] of downloads) await writeFile(new URL(file, root), contents);
  const updated = JSON.stringify(versions, null, 2) + '\n';
  if (updated !== original) await writeFile(new URL(manifestPath, root), updated);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await syncNodeApi();
  console.log('Node API specs match the selected network versions.');
}
