import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { parse } from 'yaml';
import { syncAppApi } from './sync-app-api.mjs';

const commit = 'a'.repeat(40);
const upstream = () => ({
  swagger: '2.0', info: { title: 'Celestia App', version: 'v10' },
  paths: {
    '/blob/v1/params': { get: { operationId: 'Params', responses: { 200: { description: 'OK' } } } },
    '/fibre/v1/params': { get: { operationId: 'Params', responses: { 200: { description: 'OK' } } } },
  },
});

async function fixture(t) {
  const dir = await mkdtemp(path.join(tmpdir(), 'app-api-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const root = pathToFileURL(`${dir}/`);
  await mkdir(new URL('constants/', root));
  await mkdir(new URL('public/', root));
  const write = (file, value) => writeFile(new URL(file, root), JSON.stringify(value));
  const read = () => readFile(new URL('public/openapi.json', root), 'utf8');
  await write('constants/mainnet_versions.json', { 'app-latest-tag': 'v10.4.0', 'app-latest-sha': commit });
  await write('constants/mocha_versions.json', { 'app-latest-tag': 'v11.0.0-mocha', 'app-latest-sha': 'b'.repeat(40) });
  await write('public/openapi.json', upstream());
  return { root, write, read };
}

test('uses the documented Mainnet version, normalises IDs and is offline/idempotent once synced', async t => {
  const { root, read, write } = await fixture(t);
  await assert.rejects(syncAppApi({ root, check: true }), /version must match/);
  await syncAppApi({ root, generate: async selection => {
    assert.deepEqual(selection, { version: 'v10.4.0', commit });
    return upstream();
  } });
  const saved = await read();
  const spec = JSON.parse(saved);
  assert.equal(spec.info.version, 'v10.4.0');
  assert.equal(spec['x-celestia-app-commit'], commit);
  assert.equal(spec.paths['/blob/v1/params'].get.operationId, 'get_blob_v1_params');
  assert.equal(spec.paths['/fibre/v1/params'].get.operationId, 'get_fibre_v1_params');
  for (const check of [true, false]) {
    await syncAppApi({ root, check, generate: () => assert.fail('No generation needed') });
    assert.equal(await read(), saved);
  }
  await write('constants/mainnet_versions.json', { 'app-latest-tag': 'v10.5.0', 'app-latest-sha': 'c'.repeat(40) });
  await assert.rejects(syncAppApi({ root, check: true }), /version must match/);
  await syncAppApi({ root, generate: async selection => {
    assert.deepEqual(selection, { version: 'v10.5.0', commit: 'c'.repeat(40) });
    return upstream();
  } });
  await syncAppApi({ root, check: true });
});

test('generation failures, broken references and invalid schemas preserve the last published spec', async t => {
  const { root, read } = await fixture(t);
  const before = await read();
  for (const generate of [
    async () => { throw new Error('Upstream unavailable'); },
    async () => ({ ...upstream(), paths: {} }),
    async () => { const spec = upstream(); delete spec.paths['/blob/v1/params'].get.responses; return spec; },
    async () => ({ ...upstream(), definitions: { broken: { $ref: '#/definitions/missing' } } }),
    async () => ({ ...upstream(), definitions: { broken: { $ref: 'file:///etc/passwd' } } }),
  ]) {
    await assert.rejects(syncAppApi({ root, generate }));
    assert.equal(await read(), before);
  }
});

test('checks reject a mismatched commit and non-mainnet tags', async t => {
  const { root, write } = await fixture(t);
  await syncAppApi({ root, generate: async () => upstream() });
  await write('constants/mainnet_versions.json', { 'app-latest-tag': 'v10.4.0', 'app-latest-sha': 'b'.repeat(40) });
  await assert.rejects(syncAppApi({ root, check: true }), /source commit must match/);
  for (const tag of ['v10.4.0-mocha', 'v10.4.0-rc1', 'latest']) {
    await write('constants/mainnet_versions.json', { 'app-latest-tag': tag, 'app-latest-sha': commit });
    await assert.rejects(syncAppApi({ root }), /stable Mainnet/);
  }
});

test('release automation syncs OpenAPI before opening the shared release PR', async () => {
  const workflow = parse(await readFile(new URL('../.github/workflows/latest-tags.yaml', import.meta.url), 'utf8'));
  const steps = workflow.jobs.syncLatestTags.steps;
  const sync = steps.findIndex(step => step.run?.includes('bun run sync:app-api'));
  const pr = steps.findIndex(step => step.uses?.startsWith('peter-evans/create-pull-request@'));
  assert.ok(sync >= 0 && pr > sync);
  assert.ok(steps.slice(0, sync).some(step => step.run?.includes('bun install --frozen-lockfile')));
});
