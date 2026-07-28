#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { createHash } from 'crypto';

const SITE_ORIGIN = 'https://docs.celestia.org';
const GITHUB_REPO = 'https://github.com/celestiaorg/docs';
const LATEST_OPENRPC_SPEC = '/specs/openrpc-v0.31.3.json';

// Use createRequire to import JSON files in ESM context
const require = createRequire(import.meta.url);
const mainnetVersions = require('../constants/mainnet_versions.json');
const mochaVersions = require('../constants/mocha_versions.json');
const arabicaVersions = require('../constants/arabica_versions.json');
const constants = require('../constants/general.json');

// Create a context object with all available variables
const variableContext = {
  mainnetVersions,
  mochaVersions,
  arabicaVersions,
  constants,
};

/**
 * Safely evaluates a variable expression like:
 *   mainnetVersions['app-latest-tag']
 *   mochaVersions["node-latest-tag"]
 *   constants.arabicaChainId
 *   constants['arabicaChainId']
 *
 * @param {string} expression - The expression to evaluate
 * @returns {string|null} - The resolved value or null if not found
 */
function resolveExpression(expression) {
  // First try bracket notation: objectName['key'] or objectName["key"]
  let match = expression.match(/^(\w+)\[['"]([^'"]+)['"]\]$/);

  if (match) {
    const [, objectName, key] = match;
    const obj = variableContext[objectName];

    if (!obj) {
      console.warn(`[generate-llms] Unknown variable object: ${objectName}`);
      return null;
    }

    const value = obj[key];
    if (value === undefined) {
      console.warn(`[generate-llms] Unknown key "${key}" in ${objectName}`);
      return null;
    }

    return String(value);
  }

  // Try dot notation: objectName.propertyName
  match = expression.match(/^(\w+)\.(\w+)$/);

  if (match) {
    const [, objectName, key] = match;
    const obj = variableContext[objectName];

    if (!obj) {
      console.warn(`[generate-llms] Unknown variable object: ${objectName}`);
      return null;
    }

    const value = obj[key];
    if (value === undefined) {
      console.warn(`[generate-llms] Unknown property "${key}" in ${objectName}`);
      return null;
    }

    return String(value);
  }

  console.warn(`[generate-llms] Invalid expression syntax: ${expression}`);
  return null;
}

/**
 * Replaces all variable patterns in a string with their resolved values.
 * Handles both {{expression}} (double brace) and {expression} (single brace) patterns.
 *
 * @param {string} text - The text to process
 * @returns {string} - The text with variables replaced
 */
function replaceVariables(text) {
  // First replace {{...}} patterns (double braces)
  text = text.replace(/\{\{([^{}]+)\}\}/g, (match, expression) => {
    const trimmedExpr = expression.trim();
    if (!/^(mainnetVersions|mochaVersions|arabicaVersions|constants)(?:\[['"][^'"]+['"]\]|\.\w+)$/.test(trimmedExpr)) {
      return match;
    }

    const resolved = resolveExpression(trimmedExpr);

    if (resolved !== null) {
      return resolved;
    }

    // If we couldn't resolve it, leave the original text
    return match;
  });

  // Then replace {expression} patterns (single braces) that match our variable patterns
  // Be careful to only match patterns that look like variable references
  text = text.replace(/\{((?:mainnetVersions|mochaVersions|arabicaVersions|constants)(?:\[['"][^'"]+['"]\]|\.\w+))\}/g, (match, expression) => {
    const trimmedExpr = expression.trim();
    const resolved = resolveExpression(trimmedExpr);

    if (resolved !== null) {
      return resolved;
    }

    // If we couldn't resolve it, leave the original text
    return match;
  });

  return text;
}

// Helper function to clean MDX content for LLM consumption
function cleanMdxContent(content) {
  // Remove frontmatter if present (between --- markers)
  // Frontmatter is not standard Markdown and could be confusing for LLMs
  let cleanedContent = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');

  // Remove import statements
  cleanedContent = cleanedContent.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');

  // Remove export statements (except export default)
  cleanedContent = cleanedContent.replace(/^export\s+(?!default).*?;?\s*$/gm, '');

  // Remove JSX/React components (custom components starting with capital letters)
  cleanedContent = cleanedContent.replace(/<([A-Z][a-zA-Z0-9]*)\s*[^>]*\/>/g, ''); // Self-closing components
  cleanedContent = cleanedContent.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g, ''); // Component blocks

  // Remove MDX-specific syntax like {/* comments */}
  cleanedContent = cleanedContent.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Replace variables AFTER removing imports but BEFORE final cleanup
  cleanedContent = replaceVariables(cleanedContent);

  // Clean up extra whitespace
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');

  return cleanedContent.trim();
}

const header = [
  '# Celestia documentation',
  '',
  '> Official documentation for Celestia, the modular blockchain powering unstoppable apps with full-stack control.',
  '',
  'These docs are built with Vocs and exported statically. Links below point to canonical markdown pages so tools and LLMs can ingest clean text.',
  '',
  '## Agent instructions',
  '',
  '- Prefer the `.md` pages linked here for retrieval and citations.',
  '- Use `llms-full.txt` when a single-file context snapshot is needed.',
  '- Use `/build/llms.txt`, `/learn/llms.txt`, and `/operate/llms.txt` for section-specific context.',
  '- Celestia does not currently publish an official MCP server for this documentation site.',
  '',
  '## Related resources',
  '',
  '- Full LLM context: https://docs.celestia.org/llms-full.txt',
  '- Agent skill: https://docs.celestia.org/SKILL.md',
  '- Agent skills index: https://docs.celestia.org/.well-known/agent-skills/index.json',
  '- API catalog: https://docs.celestia.org/.well-known/api-catalog',
  `- Node API OpenRPC spec: ${SITE_ORIGIN}${LATEST_OPENRPC_SPEC}`,
  '- CIPs (Celestia Improvement Proposals): https://cips.celestia.org',
];

const titleize = (segment) =>
  segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const toPosixPath = (filePath) => filePath.split(path.sep).join('/');

const markdownPathForFile = (file) => {
  let outputPath = toPosixPath(file).replace(/^app\//, '').replace(/\.mdx$/, '.md');

  if (outputPath.endsWith('/page.md')) {
    outputPath = outputPath.replace(/\/page\.md$/, '.md');
  } else if (outputPath === 'page.md') {
    outputPath = 'index.md';
  }

  return outputPath;
};

const htmlPathForFile = (file) => {
  const rel = toPosixPath(file).replace(/^app\//, '');

  if (rel === 'page.mdx') return '/';
  if (!rel.endsWith('/page.mdx')) return null;

  return `/${rel.replace(/\/page\.mdx$/, '/')}`;
};

const canonicalUrl = (pathname) => `${SITE_ORIGIN}${pathname}`;

const canonicalMarkdownUrl = (file) => `${SITE_ORIGIN}/${markdownPathForFile(file)}`;

const formatItem = (file, label) => `- [${label}](${canonicalMarkdownUrl(file)})`;

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const extractTitle = (content, fallback) => {
  const heading = content.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : fallback;
};

const sha256 = async (file) => {
  const content = await fs.readFile(file);
  return createHash('sha256').update(content).digest('hex');
};

const walkPages = async (dir) => {
  const pages = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...(await walkPages(full)));
    } else if (entry.isFile() && (entry.name === 'page.mdx' || entry.name.endsWith('.mdx'))) {
      pages.push(full);
    }
  }
  return pages;
};

const buildSections = (files) => {
  const grouped = new Map();

  for (const file of files) {
    const rel = toPosixPath(file).replace(/^app\//, '');
    const parts = rel.split('/');
    if (parts.length < 2) {
      const label = rel === 'page.mdx' ? 'Home' : titleize(rel.replace(/\.mdx$/, ''));
      if (!grouped.has('Overview')) grouped.set('Overview', []);
      grouped.get('Overview').push({ file, label });
      continue;
    }

    const [top, second, ...rest] = parts;
    // Section title: "Top" or "Top: Second"
    const sectionTitle = second ? `${titleize(top)}: ${titleize(second)}` : titleize(top);

    // Item label: remaining path segments (excluding page.mdx)
    const leafParts = rest.slice(0, -1); // drop page.mdx
    const labelSegments = leafParts.length ? leafParts : [second ?? top];
    const label = labelSegments.map(titleize).join(' / ');

    if (!grouped.has(sectionTitle)) grouped.set(sectionTitle, []);
    grouped.get(sectionTitle).push({ file, label });
  }

  // Sort sections and items for stability
  const sortedSections = [...grouped.entries()].sort(([a], [b]) => {
    if (a === 'Overview') return -1;
    if (b === 'Overview') return 1;
    return a.localeCompare(b);
  });
  return sortedSections.map(([title, items]) => ({
    title,
    items: items.sort((a, b) => a.file.localeCompare(b.file)),
  }));
};

const generateMarkdownFiles = async (outputBase, files) => {
  console.log('🤖 Generating LLM-ready markdown files...');

  console.log(`Found ${files.length} MDX files to convert`);
  console.log(`Writing markdown files to: ${outputBase}/`);

  const pages = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const cleanedContent = cleanMdxContent(content);
    const outputPath = markdownPathForFile(file);

    const outputFullPath = path.join(outputBase, outputPath);

    // Ensure the directory exists
    const outputDir = path.dirname(outputFullPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Write the cleaned markdown file
    await fs.writeFile(outputFullPath, cleanedContent, 'utf-8');
    console.log(`✅ Generated: ${outputPath}`);

    pages.push({
      file,
      markdownPath: outputPath,
      markdownUrl: canonicalMarkdownUrl(file),
      htmlPath: htmlPathForFile(file),
      content: cleanedContent,
      title: extractTitle(cleanedContent, titleize(path.basename(path.dirname(file)))),
    });
  }

  return pages;
};

const writeTextFile = async (outputBase, filePath, content) => {
  const outputFullPath = path.join(outputBase, filePath);
  await fs.mkdir(path.dirname(outputFullPath), { recursive: true });
  await fs.writeFile(outputFullPath, content, 'utf8');
};

const generateLlmsTxt = async (outputBase, sections, filePath = 'llms.txt') => {
  const lines = [...header, ''];
  sections.forEach((section) => {
    if (!section.items.length) return;
    lines.push(`## ${section.title}`, '');
    section.items.forEach((item) => lines.push(formatItem(item.file, item.label)));
    lines.push('');
  });

  const output = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  await writeTextFile(outputBase, filePath, output);
};

const generateSectionLlmsTxt = async (outputBase, sections) => {
  for (const topLevel of ['build', 'learn', 'operate']) {
    const sectionPrefix = `${titleize(topLevel)}: `;
    const sectionItems = sections.filter((section) => section.title.startsWith(sectionPrefix));
    const lines = [
      `# Celestia ${titleize(topLevel)} documentation`,
      '',
      `> Section-specific LLM index for the ${titleize(topLevel)} area of the Celestia docs.`,
      '',
      '- Full docs index: https://docs.celestia.org/llms.txt',
      '- Full LLM context: https://docs.celestia.org/llms-full.txt',
      '',
    ];

    sectionItems.forEach((section) => {
      lines.push(`## ${section.title.replace(sectionPrefix, '')}`, '');
      section.items.forEach((item) => lines.push(formatItem(item.file, item.label)));
      lines.push('');
    });

    await writeTextFile(outputBase, `${topLevel}/llms.txt`, lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
  }
};

const generateLlmsFullTxt = async (outputBase, pages) => {
  const lines = [
    '# Celestia documentation full context',
    '',
    '> Full cleaned markdown export of the Celestia documentation for LLM and agent ingestion.',
    '',
  ];

  pages
    .filter((page) => page.content)
    .sort((a, b) => a.markdownPath.localeCompare(b.markdownPath))
    .forEach((page) => {
      lines.push('---');
      lines.push(`Title: ${page.title}`);
      lines.push(`URL: ${page.markdownUrl}`);
      lines.push(`Source: ${toPosixPath(page.file)}`);
      lines.push('---');
      lines.push('');
      lines.push(page.content);
      lines.push('');
    });

  await writeTextFile(outputBase, 'llms-full.txt', lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
};

const generateSitemap = async (outputBase, pages) => {
  const urls = pages
    .map((page) => page.htmlPath)
    .filter(Boolean)
    .sort()
    .map((pathname) => `  <url>\n    <loc>${escapeXml(canonicalUrl(pathname))}</loc>\n  </url>`);

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  await writeTextFile(outputBase, 'sitemap.xml', sitemap);
};

const generateRobotsTxt = async (outputBase) => {
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'Google-Extended',
    'PerplexityBot',
    'CCBot',
  ];

  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    'Content-Signal: ai-train=yes, search=yes, ai-input=yes',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ];

  await writeTextFile(outputBase, 'robots.txt', lines.join('\n'));
};

const generateAgentSkillsIndex = async (outputBase) => {
  const skillPath = '/.well-known/agent-skills/celestia/SKILL.md';
  const skillHash = await sha256('public/SKILL.md');
  const index = {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [
      {
        name: 'celestia',
        type: 'skill-md',
        description: 'Route Celestia requests to the correct repo and apply canonical blob submit/retrieve guidance with docs guardrails.',
        url: `${SITE_ORIGIN}${skillPath}`,
        digest: `sha256:${skillHash}`,
      },
    ],
  };

  await fs.mkdir(path.join(outputBase, '.well-known/agent-skills/celestia'), { recursive: true });
  await fs.copyFile('public/SKILL.md', path.join(outputBase, '.well-known/agent-skills/celestia/SKILL.md'));
  await writeTextFile(outputBase, '.well-known/agent-skills/index.json', `${JSON.stringify(index, null, 2)}\n`);
};

const generateApiCatalog = async (outputBase) => {
  const linkset = {
    linkset: [
      {
        anchor: SITE_ORIGIN,
        'service-desc': [
          {
            href: `${SITE_ORIGIN}${LATEST_OPENRPC_SPEC}`,
            type: 'application/json',
            title: 'Celestia Node API OpenRPC specification',
          },
        ],
        'service-doc': [
          {
            href: `${SITE_ORIGIN}/build/rpc/node-api/`,
            type: 'text/html',
            title: 'Celestia Node API documentation',
          },
          {
            href: `${SITE_ORIGIN}/build/rpc/clients/`,
            type: 'text/html',
            title: 'Celestia RPC clients',
          },
        ],
        describedby: [
          {
            href: `${SITE_ORIGIN}/llms.txt`,
            type: 'text/plain',
            title: 'Celestia docs LLM index',
          },
          {
            href: `${SITE_ORIGIN}/llms-full.txt`,
            type: 'text/plain',
            title: 'Celestia docs full LLM context',
          },
          {
            href: `${SITE_ORIGIN}/SKILL.md`,
            type: 'text/markdown',
            title: 'Celestia agent skill',
          },
        ],
        status: [
          {
            href: `${SITE_ORIGIN}/operate/maintenance/troubleshooting/`,
            type: 'text/html',
            title: 'Celestia troubleshooting documentation',
          },
        ],
        'source-code': [
          {
            href: GITHUB_REPO,
            type: 'text/html',
            title: 'Celestia docs repository',
          },
        ],
      },
    ],
  };

  await writeTextFile(outputBase, '.well-known/api-catalog', `${JSON.stringify(linkset, null, 2)}\n`);
};

const main = async () => {
  // Vocs writes the browser-deployable static site to `out/public`.
  // Fall back to `public` when running this script outside a production build.
  const outputBase = await fs.access('out/public').then(() => 'out/public').catch(() => 'public');
  const files = (await walkPages('app')).sort();

  // Generate individual markdown files
  const pages = await generateMarkdownFiles(outputBase, files);

  const sections = buildSections(files);
  await fs.mkdir(outputBase, { recursive: true });
  await generateLlmsTxt(outputBase, sections);
  await generateSectionLlmsTxt(outputBase, sections);
  await generateLlmsFullTxt(outputBase, pages);
  await generateSitemap(outputBase, pages);
  await generateRobotsTxt(outputBase);
  await generateAgentSkillsIndex(outputBase);
  await generateApiCatalog(outputBase);

  console.log(`Agent-ready assets generated (${outputBase}/)`);
  console.log('✨ LLM-ready markdown and discovery asset generation complete!');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
