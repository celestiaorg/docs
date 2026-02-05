#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const RAW_BASE = 'https://raw.githubusercontent.com/celestiaorg/docs/main/';

// Helper function to clean MDX content for LLM consumption
function cleanMdxContent(content) {
  // Remove frontmatter if present (between --- markers)
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  const frontmatterMatch = content.match(frontmatterRegex);
  let cleanedContent = content;
  let frontmatter = '';

  if (frontmatterMatch) {
    frontmatter = frontmatterMatch[0];
    cleanedContent = content.replace(frontmatterRegex, '');
  }

  // Remove import statements
  cleanedContent = cleanedContent.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');

  // Remove export statements (except export default)
  cleanedContent = cleanedContent.replace(/^export\s+(?!default).*?;?\s*$/gm, '');

  // Remove JSX/React components (custom components starting with capital letters)
  cleanedContent = cleanedContent.replace(/<([A-Z][a-zA-Z0-9]*)\s*[^>]*\/>/g, ''); // Self-closing components
  cleanedContent = cleanedContent.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g, ''); // Component blocks

  // Remove MDX-specific syntax like {/* comments */}
  cleanedContent = cleanedContent.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Clean up extra whitespace
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');
  cleanedContent = cleanedContent.trim();

  // Add frontmatter back if it existed
  if (frontmatter) {
    return frontmatter + cleanedContent;
  }

  return cleanedContent;
}

const header = [
  '# Celestia documentation',
  '',
  '> Official documentation for Celestia, the modular blockchain powering unstoppable apps with full-stack control.',
  '',
  'These docs are built with Next.js + Nextra and exported statically. Links below point to the raw MDX sources in `main` so tools and LLMs can ingest clean text.',
];

const titleize = (segment) =>
  segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatItem = (path, label) => `- [${label}](${RAW_BASE}${path})`;

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

const buildSections = async () => {
  const files = (await walkPages('app')).sort();

  const grouped = new Map();

  for (const file of files) {
    const rel = file.replace(/^app\//, '');
    const parts = rel.split('/');
    if (parts.length < 2) continue; // skip unexpected roots

    const [top, second, ...rest] = parts;
    // Section title: "Top" or "Top: Second"
    const sectionTitle = second ? `${titleize(top)}: ${titleize(second)}` : titleize(top);

    // Item label: remaining path segments (excluding page.mdx)
    const leafParts = rest.slice(0, -1); // drop page.mdx
    const labelSegments = leafParts.length ? leafParts : [second ?? top];
    const label = labelSegments.map(titleize).join(' / ');

    if (!grouped.has(sectionTitle)) grouped.set(sectionTitle, []);
    grouped.get(sectionTitle).push({ path: file, label });
  }

  // Sort sections and items for stability
  const sortedSections = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b));
  return sortedSections.map(([title, items]) => ({
    title,
    items: items.sort((a, b) => a.path.localeCompare(b.path)),
  }));
};

const generateMarkdownFiles = async () => {
  console.log('🤖 Generating LLM-ready markdown files...');

  // Find all MDX files
  const files = await walkPages('app');

  console.log(`Found ${files.length} MDX files to convert`);

  // Determine output directory - use 'out' if it exists (during build), otherwise 'public' (during dev)
  const outputBase = await fs.access('out').then(() => 'out').catch(() => 'public');
  console.log(`Writing markdown files to: ${outputBase}/`);

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const cleanedContent = cleanMdxContent(content);

    // Determine output path
    let outputPath = file.replace(/^app\//, '').replace(/\.mdx$/, '.md');

    // Handle page.mdx files - they should become index.md
    if (outputPath.endsWith('/page.md')) {
      outputPath = outputPath.replace('/page.md', '.md');
    } else if (outputPath === 'page.md') {
      outputPath = 'index.md';
    }

    const outputFullPath = path.join(outputBase, outputPath);

    // Ensure the directory exists
    const outputDir = path.dirname(outputFullPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Write the cleaned markdown file
    await fs.writeFile(outputFullPath, cleanedContent, 'utf-8');
    console.log(`✅ Generated: ${outputPath}`);
  }
};

const main = async () => {
  // Generate individual markdown files
  await generateMarkdownFiles();

  // Also generate the index file
  const sections = await buildSections();
  const lines = [...header, ''];
  sections.forEach((section) => {
    if (!section.items.length) return;
    lines.push(`## ${section.title}`, '');
    section.items.forEach((item) => lines.push(formatItem(item.path, item.label)));
    lines.push('');
  });

  const output = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  // Determine output directory - use 'out' if it exists (during build), otherwise 'public' (during dev)
  const outputBase = await fs.access('out').then(() => 'out').catch(() => 'public');

  // Write llms.txt to the appropriate directory
  await fs.mkdir(outputBase, { recursive: true });
  await fs.writeFile(path.join(outputBase, 'llms.txt'), output, 'utf8');

  console.log(`llms.txt generated (${outputBase}/)`);
  console.log('✨ LLM-ready markdown generation complete!');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
