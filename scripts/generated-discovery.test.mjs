import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import test from 'node:test';
import path from 'node:path';

const read = file => readFileSync(new URL(`../out/public/${file}`, import.meta.url), 'utf8');
const siteOrigin = process.env.VOCS_BASE_URL || 'https://docs.celestia.org';
const localFile = url => new URL(`../out/public/${new URL(url).pathname.slice(1)}`, import.meta.url);

test('generated discovery resources point to real exported content', () => {
  assert.match(read('index.md'), /^# Celestia docs$/m);
  assert.ok(read('index.md').includes('Scalable, custom blockchain infrastructure for the most ambitious applications.'));
  assert.match(read('llms.md'), /^# Celestia documentation/);
  assert.equal(read('llms.md'), read('llms.txt'));
  assert.deepEqual(JSON.parse(read('.well-known/poppy.json')), {
    protocol_version: '0.1',
    organization: { name: 'Celestia', domain: new URL(siteOrigin).hostname },
    web: {},
  });

  const { entries } = JSON.parse(read('.well-known/ard.json'));
  const aiCatalog = JSON.parse(read('.well-known/ai-catalog.json'));
  assert.equal(aiCatalog.specVersion, '1.0');
  assert.deepEqual(aiCatalog.entries, entries);
  assert.equal(aiCatalog.host.identifier, 'did:web:docs.celestia.org');
  assert.equal(entries[0].type, 'application/agent-skills+md');
  if (process.env.DOCS_MCP_ENABLED === '1') {
    const card = JSON.parse(read('mcp/server-card'));
    assert.equal(card.name, 'org.celestia/docs');
    assert.equal(card.remotes[0].url, `${siteOrigin}/mcp`);
    assert.equal(entries[1].type, 'application/mcp-server-card+json');
    assert.equal(entries[1].url, `${siteOrigin}/mcp/server-card`);
  } else assert.equal(entries.length, 1);
  assert.equal(readFileSync(localFile(entries[0].url), 'utf8'), readFileSync(new URL('../public/SKILL.md', import.meta.url), 'utf8'));

  const { linkset } = JSON.parse(read('.well-known/api-catalog'));
  const catalog = linkset.find(link => link.anchor === `${siteOrigin}/.well-known/api-catalog`);
  assert.ok(catalog, 'api-catalog anchor');
  assert.equal(catalog.item.length, 3);
  for (const item of catalog.item.filter(item => item.href.includes('/specs/openrpc-'))) {
    const spec = JSON.parse(readFileSync(new URL(`../public/specs/${path.basename(new URL(item.href).pathname)}`, import.meta.url), 'utf8'));
    assert.ok(spec.openrpc);
    assert.ok(spec.methods.length);
  }

  const groups = read('robots.txt').split('\n\n').filter(group => group.startsWith('User-agent:'));
  assert.ok(groups.length > 1);
  for (const group of groups) assert.match(group, /Content-Signal: ai-train=yes, search=yes, ai-input=yes/, group);
});

// Run after a build to check every HTML-to-Markdown discovery link as well.
test('exported HTML advertises matching Markdown pages', { skip: !existsSync(new URL('../out/public/index.html', import.meta.url)) }, () => {
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
    const basePath = (process.env.BASE || '').replace(/\/$/, '');
    // Vocs adds <base href>, so discovery links must include the deployment path.
    const documentBase = html.match(/<base href="([^"]+)"/)?.[1] || url;
    assert.equal(new URL(alternates[0][1], documentBase).href, new URL(`${basePath}/${markdownPath}`, siteOrigin).href);
    assert.match(html, /<link rel="ard" type="application\/json" href="[^"]*\/\.well-known\/ard\.json"\s*\/>/);
    const aiCatalogLink = html.match(/<link rel="ai-catalog" type="application\/json" href="([^"]+)"\s*\/>/);
    assert.ok(aiCatalogLink, url);
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

test('homepage HTML is usable without JavaScript', { skip: !existsSync(new URL('../out/public/index.html', import.meta.url)) }, () => {
  const html = read('index.html');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, 'Rendered main content');
  assert.doesNotMatch(main, /<script\b/i, 'Homepage main content must not contain scripts');
  const text = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.ok(text.length >= 500, `Only ${text.length} characters of homepage content`);
  assert.equal([...main.matchAll(/<h1\b/g)].length, 1);
  // Vocs cards use labelled links rather than heading elements.
  assert.deepEqual([...main.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1])), [1]);
  assert.match(html, /<title>Celestia documentation<\/title>/);
  assert.match(html, /<html[^>]*lang="en"/);
  assert.match(html, /<meta property="og:type" content="website"/);
  assert.ok(html.includes(`<meta property="og:image" content="${siteOrigin}${(process.env.BASE || '').replace(/\/$/, '')}/Celestia-og.png"`));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema['@type'] === 'Organization' && schema.name === 'Celestia'));
  assert.ok(schemas.some(schema => schema['@type'] === 'WebSite' && schema.description && schema.url === 'https://docs.celestia.org'));
});

test('GitHub Pages rollback rules scope discovery to docs', () => {
  const rule = name => JSON.parse(readFileSync(new URL(`../config/cloudflare/${name}.json`, import.meta.url), 'utf8'));
  const discovery = rule('discovery-headers');
  assert.equal(discovery.expression, 'http.host eq "docs.celestia.org"');
  assert.equal(discovery.action_parameters.headers.link.operation, 'add');
  assert.match(discovery.action_parameters.headers.link.value, /<\/.well-known\/api-catalog>; rel="api-catalog"/);
  const catalog = rule('api-catalog-content-type');
  assert.equal(catalog.expression, `${discovery.expression} and http.request.uri.path eq "/.well-known/api-catalog" and http.response.code eq 200`);
  assert.equal(catalog.action, 'rewrite');
  assert.deepEqual(catalog.action_parameters.headers['content-type'], {
    operation: 'set',
    value: 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  });
});


test('sitemap covers every source page exactly once and robots advertises it', () => {
  const sitemap = read('sitemap.xml');
  assert.match(sitemap, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  const actual = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort();
  const expected = readdirSync(new URL('../app/', import.meta.url), { recursive: true })
    .filter(file => file === 'page.mdx' || file.endsWith('/page.mdx'))
    .map(file => `${siteOrigin}/${file.replace(/page\.mdx$/, '')}`).sort();
  assert.deepEqual(actual, expected);
  assert.equal(new Set(actual).size, actual.length);
  assert.ok(read('robots.txt').includes(`Sitemap: ${siteOrigin}/sitemap.xml`));
});

test('OpenAPI is a real upstream contract with resolvable references and discovery links', () => {
  const spec = JSON.parse(readFileSync(new URL('../public/openapi.json', import.meta.url), 'utf8'));
  assert.equal(spec.swagger, '2.0');
  assert.ok(spec.paths['/blob/v1/params'].get);
  assert.ok(spec.produces.includes('application/json'));
  for (const item of Object.values(spec.paths)) {
    for (const operation of Object.values(item)) {
      assert.ok(operation.responses['200'].schema, operation.operationId);
      assert.equal(operation.responses.default.schema.$ref, '#/definitions/rpcStatus');
    }
  }
  assert.equal(spec.definitions.rpcStatus.properties.code.type, 'integer');
  assert.equal(spec.definitions.rpcStatus.properties.message.type, 'string');
  const ids = Object.values(spec.paths).flatMap(item => Object.values(item).map(operation => operation.operationId));
  assert.ok(ids.every(Boolean));
  assert.equal(new Set(ids).size, ids.length, 'Operation IDs must be unique');
  for (const match of JSON.stringify(spec).matchAll(/"\$ref":"#\/([^" ]+)"/g)) {
    const value = match[1].split('/').reduce((value, key) => value?.[key.replaceAll('~1', '/').replaceAll('~0', '~')], spec);
    assert.ok(value, `Unresolved reference: ${match[0]}`);
  }
  assert.ok(read('llms.txt').includes(`${siteOrigin}/openapi.json`));
  assert.ok(JSON.parse(read('.well-known/api-catalog')).linkset[0].item.some(item => item.href === `${siteOrigin}/openapi.json`));
});

test('security.txt provides the canonical private disclosure channel and a future expiry', () => {
  const security = readFileSync(new URL('../public/.well-known/security.txt', import.meta.url), 'utf8');
  assert.match(security, /^Contact: mailto:security@celestia\.org$/m);
  assert.match(security, /^Canonical: https:\/\/docs.celestia.org\/\.well-known\/security.txt$/m);
  assert.ok(Date.parse(security.match(/^Expires: (.+)$/m)?.[1]) > Date.now());
});

test('every rendered page has trust links and page-specific structured data', { skip: !existsSync(new URL('../out/public/index.html', import.meta.url)) }, () => {
  for (const [, url] of read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const pathname = new URL(url).pathname;
    const html = read(path.join(pathname, 'index.html'));
    const base = (process.env.BASE || '').replace(/\/$/, '');
    for (const href of [`${base}/about/`, `${base}/contact/`, `${base}/privacy/`, `${base}/build/developers/`, 'https://celestia.org/tos/', 'https://github.com/celestiaorg/.github/blob/main/SECURITY.md']) {
      assert.ok(html.includes(`href="${href}"`), `${url}: missing ${href}`);
    }
    assert.match(html, /rel="service-desc"[^>]*href="[^" ]*\/openapi.json"/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.ok(schemas.some(schema => schema['@type'] === 'Organization' && schema.description));
    const articles = schemas.filter(schema => schema['@type'] === 'TechArticle');
    assert.equal(articles.length, pathname === '/' ? 0 : 1, url);
    if (pathname === '/') continue;
    const title = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
    assert.equal(articles[0].headline.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'), title, url);
    assert.equal(articles[0].url, url);
    const crumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
    assert.equal(crumbs.itemListElement.at(-1).item, url);
  }
});

test('developer and trust pages are useful, indexed and linked to canonical resources', () => {
  for (const route of ['build/developers', 'about', 'contact', 'privacy', 'build/rpc/authentication', 'build/rpc/clients']) {
    const markdown = read(`${route}.md`);
    assert.match(markdown, /# .*Celestia/);
    assert.ok(markdown.replace(/\[[^\]]*\]\([^)]*\)/g, '').length > 500, route);
    assert.ok(read('llms.txt').includes(`${siteOrigin}/${route}.md`), route);
    assert.ok(read('sitemap.xml').includes(`${siteOrigin}/${route}/`), route);
  }
  const portal = read('build/developers.md');
  for (const target of ['/openapi.json', '/build/rpc/authentication', '/build/rpc/clients', '/build/post-retrieve-blob/client/go', '/build/post-retrieve-blob/client/rust']) {
    assert.ok(portal.includes(`](${target})`), target);
  }
  const hasLink = (file, target) => [...read(file).matchAll(/\]\(([^)]+)\)/g)].some(match => match[1] === target);
  assert.ok(hasLink('privacy.md', 'https://celestia.org/privacy/'));
  assert.ok(hasLink('contact.md', 'mailto:security@celestia.org'));
});
