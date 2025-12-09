#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const RAW_BASE = 'https://raw.githubusercontent.com/celestiaorg/docs/main/';


const header = [
  '# Celestia documentation',
  '',
  '> Official documentation for Celestia, the modular data availability network for building scalable, sovereign rollups and applications.',
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
    } else if (entry.isFile() && entry.name === 'page.mdx') {
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

const main = async () => {
  const sections = await buildSections();
  const lines = [...header, ''];
  sections.forEach((section) => {
    if (!section.items.length) return;
    lines.push(`## ${section.title}`, '');
    section.items.forEach((item) => lines.push(formatItem(item.path, item.label)));
    lines.push('');
  });

  const output = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  // Write to public/ so it gets published with static export (serves at /llms.txt).
  await fs.mkdir('public', { recursive: true });
  await fs.writeFile('public/llms.txt', output, 'utf8');

  console.log('llms.txt generated (public/)');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
