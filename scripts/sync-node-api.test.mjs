import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { syncNodeApi } from './sync-node-api.mjs';

const spec = (version) => JSON.stringify({
  openrpc: '1.2.6', info: { version }, methods: [{ name: 'blob.Submit' }],
});

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'node-api-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const root = pathToFileURL(`${dir}/`);
  await mkdir(new URL('constants/', root));
  await mkdir(new URL('public/specs/', root), { recursive: true });
  const write = (file, text) => writeFile(new URL(file, root), text);
  const read = (file) => readFile(new URL(file, root), 'utf8');
  await write('constants/mainnet_versions.json', JSON.stringify({ 'node-latest-tag': 'v0.33.2' }));
  await write('constants/mocha_versions.json', JSON.stringify({ 'node-latest-tag': 'v0.34.3-mocha' }));
  await write('constants/node_api_versions.json', JSON.stringify({
    mainnet: 'v0.33.2', mocha: 'v0.34.2-mocha', historical: ['v0.31.4'],
  }));
  await write('public/specs/openrpc-v0.33.2.json', spec('v0.33.2'));
  await write('public/specs/openrpc-v0.34.2-mocha.json', spec('v0.34.2-mocha'));
  return { root, read, write };
}

test('repairs API drift without a new version bump, preserves history, and is idempotent', async (t) => {
  const { root, read } = await fixture(t);
  const downloaded = spec('v0.34.3-mocha');
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(url);
    return new Response(downloaded);
  };
  await syncNodeApi({ root, fetchImpl });
  assert.deepEqual(urls, ['https://github.com/celestiaorg/celestia-node/releases/download/v0.34.3-mocha/openrpc.json']);
  const manifest = await read('constants/node_api_versions.json');
  assert.deepEqual(JSON.parse(manifest), {
    mainnet: 'v0.33.2', mocha: 'v0.34.3-mocha', historical: ['v0.34.2-mocha', 'v0.31.4'],
  });
  assert.equal(await read('public/specs/openrpc-v0.34.3-mocha.json'), downloaded);
  await syncNodeApi({ root, fetchImpl: () => assert.fail('No download needed') });
  assert.equal(await read('constants/node_api_versions.json'), manifest);
});

test('missing, malformed or wrong-version assets leave the manifest and specs untouched', async (t) => {
  for (const response of [
    () => new Response('missing', { status: 404 }),
    () => new Response('<html>error</html>'),
    () => new Response(spec('v0.34.2-mocha')),
    () => new Response(JSON.stringify({ openrpc: '1.2.6', info: { version: 'v0.34.3-mocha' }, methods: [] })),
  ]) {
    const { root, read } = await fixture(t);
    const before = await read('constants/node_api_versions.json');
    await assert.rejects(syncNodeApi({ root, fetchImpl: async () => response() }));
    assert.equal(await read('constants/node_api_versions.json'), before);
    await assert.rejects(read('public/specs/openrpc-v0.34.3-mocha.json'), { code: 'ENOENT' });
  }
});

test('validates both networks before writing any downloaded assets', async (t) => {
  const { root, read, write } = await fixture(t);
  await write('constants/mainnet_versions.json', JSON.stringify({ 'node-latest-tag': 'v0.33.3' }));
  await assert.rejects(syncNodeApi({ root, fetchImpl: async (url) =>
    url.includes('v0.33.3') ? new Response(spec('v0.33.3')) : new Response('missing', { status: 404 }),
  }));
  await assert.rejects(read('public/specs/openrpc-v0.33.3.json'), { code: 'ENOENT' });
});

test('rejects invalid network tags and corrupt existing assets', async (t) => {
  const { root, write } = await fixture(t);
  await write('constants/mainnet_versions.json', JSON.stringify({ 'node-latest-tag': 'v0.34.3-mocha' }));
  await assert.rejects(syncNodeApi({ root }), /Invalid mainnet node tag/);
  await write('constants/mainnet_versions.json', JSON.stringify({ 'node-latest-tag': 'v0.33.2' }));
  await write('public/specs/openrpc-v0.33.2.json', spec('v0.33.1'));
  await assert.rejects(syncNodeApi({ root }), /Spec version mismatch/);
});
