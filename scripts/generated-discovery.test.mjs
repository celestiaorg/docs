import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import path from 'node:path';

const read = file => readFileSync(new URL(`../out/${file}`, import.meta.url), 'utf8');
const localFile = url => new URL(`../out/${new URL(url).pathname.slice(1)}`, import.meta.url);

test('generated discovery resources point to real exported content', () => {
  assert.match(read('index.md'), /^# Celestia docs/);
  assert.match(read('llms.md'), /^# Celestia documentation/);
  assert.equal(read('llms.md'), read('llms.txt'));

  const { entries } = JSON.parse(read('.well-known/ard.json'));
  assert.equal(entries[0].type, 'application/agent-skills+md');
  assert.equal(readFileSync(localFile(entries[0].url), 'utf8'), readFileSync(new URL('../public/SKILL.md', import.meta.url), 'utf8'));

  const { linkset } = JSON.parse(read('.well-known/api-catalog'));
  assert.equal(linkset[0].item.length, 2);
  for (const item of linkset[0].item) {
    const spec = JSON.parse(readFileSync(new URL(`../public/specs/${path.basename(new URL(item.href).pathname)}`, import.meta.url), 'utf8'));
    assert.ok(spec.openrpc);
    assert.ok(spec.methods.length);
  }

  const wildcardGroup = read('robots.txt').split('User-agent: GPTBot')[0];
  assert.match(wildcardGroup, /Content-Signal: ai-train=yes, search=yes, ai-input=yes/);
});

// Run after a build to check every HTML-to-Markdown discovery link as well.
test('exported HTML advertises matching Markdown pages', { skip: !existsSync(new URL('../out/index.html', import.meta.url)) }, () => {
  const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.ok(urls.length > 1);
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    const markdownPath = pathname === '/' ? 'index.md' : `${pathname.slice(1, -1)}.md`;
    const html = read(path.join(pathname, 'index.html'));
    const alternate = `<link rel="alternate" type="text/markdown" href="https://docs.celestia.org/${markdownPath}"/>`;
    assert.equal(html.split(alternate).length - 1, 1, url);
    assert.ok(read(markdownPath).trim(), markdownPath);
  }
});
