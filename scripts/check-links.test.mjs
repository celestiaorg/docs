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
