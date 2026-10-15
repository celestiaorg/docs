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
  const catalog = linkset.find(link => link.anchor === 'https://docs.celestia.org/.well-known/api-catalog');
  assert.ok(catalog, 'api-catalog anchor');
  assert.equal(catalog.item.length, 2);
  for (const item of catalog.item) {
    const spec = JSON.parse(readFileSync(new URL(`../public/specs/${path.basename(new URL(item.href).pathname)}`, import.meta.url), 'utf8'));
    assert.ok(spec.openrpc);
    assert.ok(spec.methods.length);
  }

  const groups = read('robots.txt').split('\n\n').filter(group => group.startsWith('User-agent:'));
  assert.ok(groups.length > 1);
  for (const group of groups) assert.match(group, /Content-Signal: ai-train=yes, search=yes, ai-input=yes/, group);
});

// Run after a build to check every HTML-to-Markdown discovery link as well.
test('exported HTML advertises matching Markdown pages', { skip: !existsSync(new URL('../out/index.html', import.meta.url)) }, () => {
  const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.ok(urls.length > 1);
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    const markdownPath = pathname === '/' ? 'index.md' : `${pathname.slice(1, -1)}.md`;
    const html = read(path.join(pathname, 'index.html'));
    const alternates = [...html.matchAll(/<link rel="alternate" type="text\/markdown" href="([^"]+)"\s*\/>/g)];
    assert.equal(alternates.length, 1, url);
    // Relative href must resolve under any deployment base, including previews.
    const base = 'https://example.com/sub/path/';
    assert.equal(new URL(alternates[0][1], new URL(pathname.slice(1), base)).href, new URL(markdownPath, base).href);
    assert.match(html, /<link rel="ard" type="application\/json" href="[^"]*\/\.well-known\/ard\.json"\s*\/>/);
    assert.ok(read(markdownPath).trim(), markdownPath);
  }
});
