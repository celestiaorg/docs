import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import SwaggerParser from '@apidevtools/swagger-parser';
import { parse } from 'yaml';

const exec = promisify(execFile);
const methods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch']);

async function validate(spec, { version, commit }) {
  assert.equal(spec.swagger, '2.0');
  assert.equal(spec.info?.version, version, 'OpenAPI version must match Mainnet Beta celestia-app');
  assert.equal(spec['x-celestia-app-commit'], commit, 'OpenAPI source commit must match Mainnet Beta celestia-app');
  assert.ok(Object.keys(spec.paths ?? {}).length, 'Empty OpenAPI paths');
  // Validation must never follow a downloaded reference to a local file or URL.
  for (const [, ref] of JSON.stringify(spec).matchAll(/"\$ref":"([^"]+)"/g)) {
    assert.ok(ref.startsWith('#/'), `External OpenAPI reference: ${ref}`);
  }
  await SwaggerParser.validate(globalThis.structuredClone(spec), { resolve: { external: false } });
}

export async function generateAppApi({ version, commit }) {
  const temporary = await mkdtemp(path.join(tmpdir(), 'celestia-app-api-'));
  const source = path.join(temporary, 'source');
  const bin = path.join(temporary, 'bin');
  const run = (command, args, cwd = temporary, env = process.env) =>
    exec(command, args, { cwd, env, timeout: 15 * 60_000, maxBuffer: 10 * 1024 * 1024 });
  try {
    await run('git', ['clone', '--quiet', '--depth=1', '--branch', version, 'https://github.com/celestiaorg/celestia-app.git', source]);
    const { stdout } = await run('git', ['rev-parse', 'HEAD'], source);
    assert.equal(stdout.trim(), commit, `Upstream tag ${version} moved; refusing to generate`);
    const read = file => readFile(path.join(source, file), 'utf8');
    const makefile = await read('Makefile');
    const bufVersion = makefile.match(/^BUF_VERSION=(v\d+\.\d+\.\d+)$/m)?.[1];
    const pluginVersion = makefile.match(/^GRPC_GATEWAY_PROTOC_GEN_OPENAPIV2_VERSION=(\d+\.\d+\.\d+)$/m)?.[1];
    assert.ok(bufVersion && pluginVersion, 'Upstream OpenAPI tool versions are missing');
    await mkdir(bin);
    const env = { ...process.env, GOBIN: bin, GOWORK: 'off', PATH: `${bin}${path.delimiter}${process.env.PATH}` };
    await run('go', ['install', `github.com/bufbuild/buf/cmd/buf@${bufVersion}`], temporary, env);
    await run('go', ['install', `github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@v${pluginVersion}`], temporary, env);

    // Upstream's second generate command floats to the SDK's latest BSR revision.
    // Use the release's lockfile so dependency APIs cannot drift between runs.
    const sdk = parse(await read('proto/buf.lock')).deps.find(dep => dep.owner === 'cosmos' && dep.repository === 'cosmos-sdk');
    assert.match(sdk?.commit ?? '', /^[a-f0-9]{32}$/);
    const script = await read('scripts/proto-swagger-gen.sh');
    const command = 'buf generate buf.build/cosmos/cosmos-sdk ';
    assert.ok(script.includes(command), 'Upstream Swagger generation changed; review dependency pinning');
    await writeFile(path.join(source, 'scripts/proto-swagger-gen.sh'), script.replace(command, `buf generate buf.build/cosmos/cosmos-sdk:${sdk.commit} `));
    await run('bash', ['scripts/proto-swagger-gen.sh'], source, env);
    return JSON.parse(await read('docs/swagger/swagger.json'));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

export async function syncAppApi({ root = new URL('../', import.meta.url), check = false, generate = generateAppApi } = {}) {
  const versions = JSON.parse(await readFile(new URL('constants/mainnet_versions.json', root), 'utf8'));
  const version = versions['app-latest-tag'];
  const commit = versions['app-latest-sha'];
  assert.match(version ?? '', /^v\d+\.\d+\.\d+$/, 'Expected a stable Mainnet Beta app tag');
  assert.match(commit ?? '', /^[a-f0-9]{40}$/, 'Expected a Mainnet Beta app commit');
  const target = new URL('public/openapi.json', root);
  try {
    await validate(JSON.parse(await readFile(target, 'utf8')), { version, commit });
    return;
  } catch (error) {
    if (check) throw error;
  }

  console.log(`Generating OpenAPI from celestia-app ${version} (${commit})`);
  const spec = await generate({ version, commit });
  assert.equal(spec.swagger, '2.0');
  const operations = Object.entries(spec.paths ?? {}).flatMap(([route, item]) =>
    Object.entries(item).filter(([method]) => methods.has(method)).map(([method, operation]) => ({ route, method, operation })));
  const counts = new Map();
  for (const { operation } of operations) counts.set(operation.operationId, (counts.get(operation.operationId) ?? 0) + 1);
  for (const { route, method, operation } of operations) {
    if (counts.get(operation.operationId) > 1) {
      operation.operationId = `${method}_${route.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
    }
  }
  spec.info.version = version;
  spec['x-celestia-app-commit'] = commit;
  await validate(spec, { version, commit });
  // A failed generation or validation leaves the last good published spec untouched.
  const pending = new URL('public/openapi.json.tmp', root);
  await writeFile(pending, JSON.stringify(spec, null, 2) + '\n');
  await rename(pending, target);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await syncAppApi({ check: process.argv.includes('--check') });
  console.log('OpenAPI matches the documented Mainnet Beta celestia-app release.');
}
