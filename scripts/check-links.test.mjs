import assert from 'node:assert/strict';
import test from 'node:test';
import { checkExternalLink, checkInternalLink } from './check-links.mjs';

test('internal discovery links resolve public files before stripping Markdown extensions', () => {
  for (const href of ['/SKILL.md', '/.well-known/security.txt', '/llms.txt', '/llms-full.txt', '/sitemap.xml', '/mcp/server-card', '/.well-known/ai-catalog.json']) {
    assert.equal(checkInternalLink(href, new Set()).valid, true, href);
  }
  for (const href of ['/missing.txt', '/missing.md', '/missing.json', '/specs/']) {
    assert.equal(checkInternalLink(href, new Set()).valid, false, href);
  }
  assert.equal(checkInternalLink('/guide.md', new Set(['/guide'])).valid, true);
});

test('a GitHub 5xx that survives retries is skipped, other hosts still fail', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }));
  const check = (url) => checkExternalLink(url, [], [], 1000, 2, 1);

  const github = await check('https://github.com/celestiaorg/celestia-app/blob/main/go.mod');
  assert.equal(github.valid, true);
  assert.equal(github.skipped, true);

  assert.equal((await check('https://example.com/missing')).valid, false);
});

const blockworksUrl = 'https://app.blockworks.com/analytics/celestia';

test('the Blockworks 429 exception waits for all retries and emits an explicit warning', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 429 }));
  const warn = t.mock.method(console, 'warn', () => {});
  t.mock.method(Math, 'random', () => 0);

  const result = await checkExternalLink(blockworksUrl, [], [], 1000, 3, 1);
  assert.equal(fetch.mock.callCount(), 3);
  assert.equal(result.skipped, true);
  assert.equal(result.status, 429);
  assert.match(result.reason, /after 3 attempts.*link not verified/);
  assert.equal(warn.mock.callCount(), 1);
  const warning = String(warn.mock.calls[0].arguments[0]);
  const expected = `${blockworksUrl}: ${result.reason}`;
  assert.equal(warning.slice(-expected.length), expected);
  assert.ok(warning.startsWith('Warning: ') || warning.startsWith('::warning::'));
});

test('a successful Blockworks response, including recovery after a retry, is verified', async (t) => {
  let status = 200;
  const fetch = t.mock.method(globalThis, 'fetch', async () => {
    const response = new Response(null, { status });
    status = 200;
    return response;
  });
  const warn = t.mock.method(console, 'warn', () => {});
  t.mock.method(Math, 'random', () => 0);

  for (const initialStatus of [200, 429]) {
    status = initialStatus;
    const result = await checkExternalLink(blockworksUrl, [], [], 1000, 3, 1);
    assert.equal(result.valid, true);
    assert.equal(result.status, 200);
    assert.equal(result.skipped, undefined);
  }
  assert.equal(fetch.mock.callCount(), 3);
  assert.equal(warn.mock.callCount(), 0);
});

test('429 responses from any other URL still fail', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 429 }));
  for (const url of [
    'https://example.com/',
    'https://app.blockworks.com/analytics/other',
    `${blockworksUrl}/`,
    `${blockworksUrl}?other=1`,
    'https://app.blockworks.com.example.com/analytics/celestia',
  ]) {
    const result = await checkExternalLink(url, [], [], 1000, 1);
    assert.equal(result.valid, false, url);
    assert.equal(result.status, 429, url);
    assert.equal(result.skipped, undefined, url);
  }
});

test('Blockworks 404, 5xx, and network errors still fail', async (t) => {
  let status;
  t.mock.method(globalThis, 'fetch', async () => {
    if (status === undefined) throw new Error('Network unavailable');
    return new Response(null, { status });
  });
  const warn = t.mock.method(console, 'warn', () => {});
  for (status of [404, 500, 502, 503, 504, undefined]) {
    const result = await checkExternalLink(blockworksUrl, [], [], 1000, 1);
    assert.equal(result.valid, false, String(status));
    assert.equal(result.status, status);
    assert.equal(result.skipped, undefined);
  }
  assert.equal(warn.mock.callCount(), 0);
});
