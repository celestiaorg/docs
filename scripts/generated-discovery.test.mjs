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
  assert.deepEqual(JSON.parse(read('.well-known/poppy.json')), {
    protocol_version: '0.1',
    organization: { name: 'Celestia', domain: 'docs.celestia.org' },
    web: {},
  });

  const { entries } = JSON.parse(read('.well-known/ard.json'));
  const aiCatalog = JSON.parse(read('.well-known/ai-catalog.json'));
  assert.equal(aiCatalog.specVersion, '1.0');
  assert.deepEqual(aiCatalog.entries, entries);
  assert.equal(aiCatalog.host.identifier, 'did:web:docs.celestia.org');
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
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"\s*\/>/g)];
    assert.deepEqual(canonicals.map(match => match[1]), [url], url);
    assert.match(html, /<meta name="is-agentic-site-type" content="content"\s*\/>/);
    const alternates = [...html.matchAll(/<link rel="alternate" type="text\/markdown" href="([^"]+)"\s*\/>/g)];
    assert.equal(alternates.length, 1, url);
    // Relative href must resolve under any deployment base, including previews.
    const base = 'https://example.com/sub/path/';
    assert.equal(new URL(alternates[0][1], new URL(pathname.slice(1), base)).href, new URL(markdownPath, base).href);
    assert.match(html, /<link rel="ard" type="application\/json" href="[^"]*\/\.well-known\/ard\.json"\s*\/>/);
    const aiCatalogLink = html.match(/<link rel="ai-catalog" type="application\/json" href="([^"]+)"\s*\/>/);
    assert.ok(aiCatalogLink, url);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.BASE || '').replace(/\/$/, '');
    assert.equal(aiCatalogLink[1], `${basePath}/.well-known/ai-catalog.json`);
    assert.ok(read(markdownPath).trim(), markdownPath);
  }
});

test('homepage Markdown provides meaningful product and developer guidance', () => {
  const markdown = read('index.md');
  const prose = markdown.replace(/\[[^\]]+\]\([^)]*\)/g, '').replace(/[#*]/g, '').replace(/\s+/g, ' ').trim();
  assert.ok(prose.length >= 500, `Only ${prose.length} characters of homepage prose`);
  assert.match(markdown, /data availability/);
  assert.match(markdown, /Go and Rust/);
});

test('homepage HTML is usable without JavaScript', { skip: !existsSync(new URL('../out/index.html', import.meta.url)) }, () => {
  const html = read('index.html');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, 'Rendered main content');
  const text = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.ok(text.length >= 500, `Only ${text.length} characters of homepage content`);
  assert.equal([...main.matchAll(/<h1\b/g)].length, 1);
  assert.deepEqual([...main.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1])), [1, 2, 2, 2, 2]);
  assert.match(html, /<title>[^<]*Celestia[^<]*data availability[^<]*<\/title>/i);
  assert.match(html, /<html[^>]*lang="en"/);
  assert.match(html, /<meta property="og:type" content="website"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/docs.celestia.org\/Celestia-og.png"/);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema['@type'] === 'Organization' && schema.name === 'Celestia'));
  assert.ok(schemas.some(schema => schema['@type'] === 'WebSite' && schema.description && schema.url === 'https://docs.celestia.org'));
});

test('Cloudflare deployment inputs scope content negotiation and discovery to docs', () => {
  const rule = name => JSON.parse(readFileSync(new URL(`../config/cloudflare/${name}.json`, import.meta.url), 'utf8'));
  const markdown = rule('markdown-negotiation');
  assert.equal(markdown.expression, 'http.host eq "docs.celestia.org"');
  assert.equal(markdown.action, 'set_config');
  assert.equal(markdown.action_parameters.content_converter, true);
  const discovery = rule('discovery-headers');
  assert.equal(discovery.expression, markdown.expression);
  assert.equal(discovery.action_parameters.headers.link.operation, 'add');
  assert.match(discovery.action_parameters.headers.link.value, /<\/.well-known\/api-catalog>; rel="api-catalog"/);
  const catalog = rule('api-catalog-content-type');
  assert.equal(catalog.expression, `${markdown.expression} and http.request.uri.path eq "/.well-known/api-catalog" and http.response.code eq 200`);
  assert.equal(catalog.action, 'rewrite');
  assert.deepEqual(catalog.action_parameters.headers['content-type'], {
    operation: 'set',
    value: 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  });
});
