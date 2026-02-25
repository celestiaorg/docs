#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '../../..');
const nodeApiContentPath = path.join(repoRoot, 'app/build/rpc/components/NodeAPIContent.tsx');
const specsDir = path.join(repoRoot, 'public/specs');
const outputDir = path.join(repoRoot, 'skills/celestia-node-api-agent/references');
const outputMarkdownPath = path.join(outputDir, 'openrpc-latest-summary.md');
const outputIndexPath = path.join(outputDir, 'openrpc-latest-index.json');

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function authLevelFromDescription(description = '') {
  const match = String(description).match(/Auth level:\s*([a-z]+)/i);
  return match ? match[1].toLowerCase() : 'unknown';
}

function parseSemverLike(tag) {
  const match = String(tag).match(/^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    pre: match[4] || '',
  };
}

function compareVersionTags(a, b) {
  const sa = parseSemverLike(a);
  const sb = parseSemverLike(b);

  if (sa && sb) {
    if (sa.major !== sb.major) return sa.major - sb.major;
    if (sa.minor !== sb.minor) return sa.minor - sb.minor;
    if (sa.patch !== sb.patch) return sa.patch - sb.patch;
    if (!sa.pre && sb.pre) return 1;
    if (sa.pre && !sb.pre) return -1;
    return sa.pre.localeCompare(sb.pre);
  }
  if (sa) return 1;
  if (sb) return -1;
  return String(a).localeCompare(String(b));
}

async function versionsFromNodeApiContent() {
  const source = await fs.readFile(nodeApiContentPath, 'utf8');
  const match = source.match(/const versions = \[([\s\S]*?)\]\.reverse\(\);/);
  if (!match) return [];

  const versions = [];
  const re = /'([^']+)'/g;
  let found;
  while ((found = re.exec(match[1])) !== null) {
    versions.push(found[1]);
  }
  return versions;
}

async function versionsFromSpecFiles() {
  const entries = await fs.readdir(specsDir);
  return entries
    .map((name) => {
      const match = name.match(/^openrpc-(.+)\.json$/);
      return match ? match[1] : null;
    })
    .filter(Boolean);
}

async function resolveLatestVersion() {
  try {
    const ordered = await versionsFromNodeApiContent();
    if (ordered.length > 0) {
      return ordered[ordered.length - 1];
    }
  } catch {
    // fallback below
  }

  const versions = await versionsFromSpecFiles();
  if (versions.length === 0) {
    throw new Error('No openrpc-*.json files found under public/specs');
  }

  return versions.sort(compareVersionTags)[versions.length - 1];
}

function summarizeMethods(spec) {
  const methods = (spec.methods || []).map((method) => {
    const [pkg, ...rest] = String(method.name || '').split('.');
    return {
      name: String(method.name || ''),
      package: pkg || 'unknown',
      short_name: rest.join('.') || String(method.name || ''),
      auth: authLevelFromDescription(method.description),
      summary: cleanText(method.summary),
      params: (method.params || []).map((param) => String(param?.name || '')).filter(Boolean),
      result: String(method?.result?.name || ''),
      deprecated: /deprecated/i.test(String(method.summary || '')) || /deprecated/i.test(String(method.description || '')),
    };
  });

  methods.sort((a, b) => a.name.localeCompare(b.name));

  const packages = {};
  for (const method of methods) {
    if (!packages[method.package]) {
      packages[method.package] = [];
    }
    packages[method.package].push(method);
  }

  const authCounts = methods.reduce((counts, method) => {
    counts[method.auth] = (counts[method.auth] || 0) + 1;
    return counts;
  }, {});

  return { methods, packages, authCounts };
}

function buildMarkdown(index) {
  const lines = [
    '# Node API OpenRPC latest reference',
    '',
    '> Auto-generated. Do not edit manually. Regenerate with `npm run generate:node-api-skill-ref`.',
    '',
    '## Snapshot',
    '',
    `- Generated at: ${index.generated_at}`,
    `- OpenRPC version: ${index.openrpc_version}`,
    `- Source file: \`${index.openrpc_file}\``,
    `- Method count: ${index.method_count}`,
    '',
    '## Auth counts',
    '',
  ];

  for (const [auth, count] of Object.entries(index.auth_counts).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`- \`${auth}\`: ${count}`);
  }

  lines.push('', '## Transaction submission methods', '');

  for (const method of index.tx_submission_methods) {
    lines.push(`- \`${method.name}\` (${method.auth})`);
    lines.push(`  - summary: ${method.summary || '(no summary)'}`);
    lines.push(`  - params: ${method.params.length ? method.params.join(', ') : '(none)'}`);
    lines.push(`  - result: ${method.result || '(unspecified)'}`);
    if (method.deprecated) {
      lines.push('  - note: marked deprecated in spec');
    }
  }

  lines.push('', '## Methods by package', '');

  for (const pkg of Object.keys(index.packages).sort()) {
    const methods = index.packages[pkg];
    lines.push(`### ${pkg} (${methods.length})`, '');
    for (const method of methods) {
      lines.push(`- \`${method.name}\` [${method.auth}]`);
      if (method.summary) {
        lines.push(`  - ${method.summary}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const latestVersion = await resolveLatestVersion();
  const specFileName = `openrpc-${latestVersion}.json`;
  const specPath = path.join(specsDir, specFileName);

  const raw = await fs.readFile(specPath, 'utf8');
  const spec = JSON.parse(raw);
  const { methods, packages, authCounts } = summarizeMethods(spec);

  const txNames = new Set([
    'blob.Submit',
    'state.SubmitPayForBlob',
    'da.Submit',
    'da.SubmitWithOptions',
  ]);

  const txSubmissionMethods = methods.filter((method) => txNames.has(method.name));

  const index = {
    generated_at: new Date().toISOString(),
    openrpc_version: cleanText(spec?.info?.version || latestVersion),
    openrpc_file: `public/specs/${specFileName}`,
    method_count: methods.length,
    auth_counts: authCounts,
    tx_submission_methods: txSubmissionMethods,
    packages,
    methods,
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputIndexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  await fs.writeFile(outputMarkdownPath, `${buildMarkdown(index)}\n`, 'utf8');

  console.log(`Generated ${path.relative(repoRoot, outputIndexPath)}`);
  console.log(`Generated ${path.relative(repoRoot, outputMarkdownPath)}`);
}

main().catch((error) => {
  console.error(`Failed to generate OpenRPC references: ${error.message}`);
  process.exit(1);
});
