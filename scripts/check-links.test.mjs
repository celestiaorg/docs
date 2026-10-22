import assert from 'node:assert/strict';
import test from 'node:test';
import { checkInternalLink } from './check-links.mjs';

test('internal discovery links resolve public files before stripping Markdown extensions', () => {
  for (const href of ['/SKILL.md', '/.well-known/security.txt', '/llms.txt', '/llms-full.txt', '/sitemap.xml']) {
    assert.equal(checkInternalLink(href, new Set()).valid, true, href);
  }
  for (const href of ['/missing.txt', '/missing.md', '/missing.json', '/specs/']) {
    assert.equal(checkInternalLink(href, new Set()).valid, false, href);
  }
  assert.equal(checkInternalLink('/guide.md', new Set(['/guide'])).valid, true);
});
