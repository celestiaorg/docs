#!/usr/bin/env node

/**
 * Link checker script for Nextra documentation
 * 
 * Scans all MDX files in app/ directory, resolves template variables,
 * and checks internal and external links for broken references.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkMath from 'remark-math';
import { visit } from 'unist-util-visit';
import remarkReplaceVariables from '../plugins/remark-replace-variables.mjs';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Configuration
const DEFAULT_CONCURRENCY = 5;
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_BACKOFF_MS = 2000; // Increased backoff to 2s
const VALID_STATUS_CODES = new Set([200, 201, 202, 204, 301, 302, 303, 307, 308]);
const RETRYABLE_STATUS_CODES = new Set([429, 500, 501, 502, 503, 504]);

// Default skip patterns (can be extended via CLI)
const DEFAULT_SKIP_PATTERNS = [
  // Social / rate-limited
  'twitter.com',
  'linkedin.com',
  't.me', // Telegram often blocks bots
  'discord.gg', // Discord often blocks bots
  // Repo blob links
  'github.com/celestiaorg/celestia-core/blob/', // GitHub blob links can be flaky or private
  'github.com/celestiaorg/blobstream-contracts/blob/', // GitHub blob links often rate-limited
  // Community tools that block automated checks
  'validao.xyz',
  'celestia.valopers.com',
  // Etherscan explorers that can be flaky
  'holesky.etherscan.io',
  // Matches lychee-action excludes in .github/workflows/lint.yaml
  'hibachi.xyz',
  'dl.acm.org/doi/abs/10.1145/98163.98167',
  'lib.rs/crates/celestia-client',
  'github.com/celestiaorg/celestia-app/blob/29906a468910184f221b42be0a15898722a2b08f/specs/src/parameters_v6.md',
  'polkachu.com/tendermint_snapshots/celestia',
  'polkachu.com/testnets/celestia/snapshots',
  'figment.io/',
];

/**
 * Build route inventory from app/ directory structure
 */
function buildRouteInventory() {
  const routes = new Set();
  
  // Add root route
  routes.add('/');
  
  // Scan for page.mdx and _page._mdx files
  const pageFiles = [
    ...glob.sync('app/**/page.mdx', { cwd: rootDir }),
    ...glob.sync('app/**/_page._mdx', { cwd: rootDir }),
  ];
  
  for (const file of pageFiles) {
    const relativePath = path.relative(path.join(rootDir, 'app'), file);
    const route = '/' + relativePath
      .replace(/\/page\.mdx$/, '/')
      .replace(/\/_page\._mdx$/, '/')
      .replace(/\\/g, '/');
    
    routes.add(route);
    // Also add without trailing slash
    if (route !== '/') {
      routes.add(route.replace(/\/$/, ''));
    }
  }

  return { routes };
}

/**
 * Check if a file exists in public directory
 */
function checkPublicAsset(assetPath) {
  // Remove leading slash
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const fullPath = path.join(rootDir, 'public', cleanPath);
  return fs.existsSync(fullPath);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an internal link is valid
 */
function checkInternalLink(href, routes) {
  // Remove hash fragment
  const [pathPart] = href.split('#');
  
  // Normalize path
  let normalized = pathPart;
  if (!normalized.startsWith('/')) {
    return { valid: false, reason: 'Relative path (not starting with /)' };
  }
  
  // Remove .md or .mdx extension if present (common mistake)
  normalized = normalized.replace(/\.(md|mdx)$/, '');
  
  // Check exact match
  if (routes.has(normalized)) {
    return { valid: true };
  }
  
  // Check with trailing slash
  const withSlash = normalized.endsWith('/') ? normalized : normalized + '/';
  const withoutSlash = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  
  if (routes.has(withSlash) || routes.has(withoutSlash)) {
    return { valid: true };
  }
  
  // Check case-insensitive match (for routes like /learn/TIA/ vs /learn/tia/)
  const normalizedLower = normalized.toLowerCase();
  const withSlashLower = withSlash.toLowerCase();
  const withoutSlashLower = withoutSlash.toLowerCase();
  
  for (const route of routes) {
    const routeLower = route.toLowerCase();
    if (routeLower === normalizedLower || routeLower === withSlashLower || routeLower === withoutSlashLower) {
      return { valid: true, note: `Case mismatch: found ${route} for ${normalized}` };
    }
  }
  
  // Check if it's a public asset
  if (normalized.startsWith('/img/') || normalized.startsWith('/specs/') || normalized.startsWith('/fonts/') || normalized.endsWith('.pdf') || normalized.endsWith('.json')) {
    if (checkPublicAsset(normalized)) {
      return { valid: true };
    }
    return { valid: false, reason: 'Public asset not found' };
  }
  
  return { valid: false, reason: 'Route not found' };
}

// Load variable context once at module level
const require = createRequire(import.meta.url);
let variableContext = {};

try {
  const mainnetVersions = require('../constants/mainnet_versions.json');
  const mochaVersions = require('../constants/mocha_versions.json');
  const arabicaVersions = require('../constants/arabica_versions.json');
  const constants = require('../constants/general.json');

  variableContext = {
    mainnetVersions,
    mochaVersions,
    arabicaVersions,
    constants,
  };
} catch (e) {
  console.warn('Warning: Could not load constant files for variable replacement', e.message);
}

/**
 * Replace template variables in a URL string
 * Handles both {{var}} and {var} syntax
 */
function replaceVariablesInUrl(url) {
  if (!url || typeof url !== 'string') return url;
  
  function resolveExpression(expression) {
    const match = expression.match(/^(\w+)\[['"]([^'"]+)['"]\]$/);
    if (!match) return null;
    
    const [, objectName, key] = match;
    const obj = variableContext[objectName];
    if (!obj || obj[key] === undefined) return null;
    
    return String(obj[key]);
  }
  
  // Replace {{expression}} patterns
  let result = url.replace(/\{\{([^{}]+)\}\}/g, (match, expression) => {
    const trimmedExpr = expression.trim();
    const resolved = resolveExpression(trimmedExpr);
    return resolved !== null ? resolved : match;
  });
  
  // Replace {expression} patterns (single brace) - e.g., {mainnetVersions['key']}
  result = result.replace(/\{(\w+)\[['"]([^'"]+)['"]\]\}/g, (match, objectName, key) => {
    const obj = variableContext[objectName];
    if (!obj || obj[key] === undefined) return match;
    return String(obj[key]);
  });
  
  return result;
}

/**
 * Extract links from markdown AST
 */
function extractLinksFromAST(tree) {
  const links = [];
  
  visit(tree, (node) => {
    // Markdown links: [text](url)
    if (node.type === 'link') {
      const processedUrl = replaceVariablesInUrl(node.url);
      links.push({
        url: processedUrl,
        text: node.children?.[0]?.value || '',
        type: 'markdown',
      });
    }
    
    // HTML anchor tags: <a href="...">
    if (node.type === 'html' && typeof node.value === 'string') {
      const htmlMatch = node.value.match(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/i);
      if (htmlMatch) {
        links.push({
          url: htmlMatch[1],
          text: '',
          type: 'html',
        });
      }
    }
    
    // MDX JSX: <Link href="..."> or <a href="...">
    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      const hrefAttr = node.attributes?.find(attr => 
        attr.name === 'href'
      );
      if (hrefAttr && hrefAttr.value) {
        let url;
        if (typeof hrefAttr.value === 'string') {
          url = hrefAttr.value;
        } else if (hrefAttr.value.type === 'mdxJsxExpressionAttribute') {
          // Skip JSX expressions like {variable}
          url = null;
        }
        if (url) {
          links.push({
            url,
            text: '',
            type: 'mdx',
          });
        }
      }
    }
  });
  
  return links;
}

/**
 * Process a single MDX file and extract links
 */
async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Parse with remark and replace variables
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkMdx) // Enable MDX support
    .use(remarkReplaceVariables);
  
  let tree;
  let links = [];
  try {
    tree = processor.parse(content);
    tree = await processor.run(tree);
    links = extractLinksFromAST(tree);
  } catch (error) {
    console.warn(`Warning: Failed to parse ${filePath}:`, error.message);
    // Continue to fallback regex extraction
  }
  
  // Also check for links in raw content (fallback)
  // This catches things that AST might miss or malformed HTML
  const rawLinkPatterns = [
    // Direct href attributes in plain strings/HTML not caught by AST
    /href=["']([^"']+)["']/gi,
  ];
  
  for (const pattern of rawLinkPatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const url = match[1];
      if (url && !url.startsWith('{') && !url.includes('{{') && !url.includes('<')) {
        // Skip if already found
        if (!links.some(l => l.url === url)) {
          links.push({
            url,
            text: '',
            type: 'raw',
          });
        }
      }
    }
  }
  
  return { file: filePath, links };
}

/**
 * Process _meta.js file and extract links
 */
async function processMetaFile(filePath) {
  const links = [];
  try {
    // Dynamic import of the _meta.js file
    const metaModule = await import(filePath);
    const metaData = metaModule.default;
    
    if (metaData && typeof metaData === 'object') {
      Object.values(metaData).forEach(value => {
        if (value && typeof value === 'object' && value.href) {
           links.push({
             url: value.href,
             text: value.title || '',
             type: '_meta',
           });
        }
      });
    }
  } catch (error) {
    console.warn(`Warning: Failed to parse ${filePath}:`, error.message);
    return { file: filePath, links: [], errors: [error.message] };
  }
  
  return { file: filePath, links };
}

/**
 * Check external link with HTTP request
 */
async function checkExternalLink(url, skipPatterns = [], timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES, backoffMs = DEFAULT_BACKOFF_MS) {
  // Check skip list
  for (const pattern of skipPatterns) {
    if (url.includes(pattern)) {
      return { valid: true, skipped: true, reason: `Skipped by pattern: ${pattern}` };
    }
  }

  async function fetchOnce() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      const validHead = VALID_STATUS_CODES.has(response.status);
      
      // Handle Retry-After header
      const retryAfter = response.headers.get('Retry-After');
      let waitTime = null;
      if (retryAfter) {
        if (/^\d+$/.test(retryAfter)) {
          waitTime = parseInt(retryAfter, 10) * 1000;
        } else {
          waitTime = new Date(retryAfter).getTime() - Date.now();
        }
      }
      
      // If HEAD fails with common problematic codes, try GET
      if (!validHead && (response.status === 404 || response.status === 405 || response.status === 403 || response.status === 500 || response.status === 501)) {
         try {
           const controllerGet = new AbortController();
           const timeoutIdGet = setTimeout(() => controllerGet.abort(), timeout);
           const responseGet = await fetch(url, {
              method: 'GET',
              signal: controllerGet.signal,
              redirect: 'follow',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'
              }
           });
           clearTimeout(timeoutIdGet);
           if (VALID_STATUS_CODES.has(responseGet.status)) {
              return {
                valid: true,
                status: responseGet.status,
                statusText: responseGet.statusText,
                method: 'GET'
              };
           }
           
           // Check Retry-After from GET response too
           const retryAfterGet = responseGet.headers.get('Retry-After');
           let waitTimeGet = null;
           if (retryAfterGet) {
             if (/^\d+$/.test(retryAfterGet)) {
               waitTimeGet = parseInt(retryAfterGet, 10) * 1000;
             } else {
               waitTimeGet = new Date(retryAfterGet).getTime() - Date.now();
             }
           }
           
           return {
             valid: VALID_STATUS_CODES.has(responseGet.status),
             status: responseGet.status,
             statusText: responseGet.statusText,
             method: 'GET',
             waitTime: waitTimeGet || waitTime
           };
        } catch {
           // Ignore GET error and return original HEAD error
         }
      }

      return {
        valid: validHead,
        status: response.status,
        statusText: response.statusText,
        method: 'HEAD',
        waitTime
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { valid: false, error: 'Timeout' };
      }
      return { valid: false, error: error.message };
    }
  }

  let lastResult = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await fetchOnce();
    lastResult = result;

    // Success or non-retryable error
    if (result.valid || result.skipped || (result.status && !RETRYABLE_STATUS_CODES.has(result.status))) {
      return result;
    }

    // Retry with backoff on retryable statuses
    if (attempt < retries) {
      let delay = result.waitTime;
      
      // If no explicit Retry-After, use exponential backoff
      if (!delay || delay < 0) {
        delay = backoffMs * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 500);
      }
      
      // Cap max delay to prevent excessive waiting (e.g. 60s)
      delay = Math.min(delay, 60000);
      
      console.log(`\nRate limited (${result.status}) for ${url}. Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  return lastResult || { valid: false, error: 'Unknown error' };
}

/**
 * Process links with concurrency control
 */
async function processLinksConcurrently(links, checkFn, concurrency) {
  const results = [];
  const total = links.length;
  let nextIndex = 0;
  let processed = 0;
  
  async function worker() {
    while (true) {
      // atomic-like claim of next item
      const index = nextIndex++;
      if (index >= total) break;
      
      const link = links[index];
      const result = await checkFn(link);
      results.push({ ...link, ...result });
      
      processed++;
      if (processed % 10 === 0 || processed === total) {
        process.stdout.write(`\rProgress: ${processed}/${total}`);
      }
    }
  }
  
  const workers = Array(Math.min(concurrency, links.length))
    .fill(null)
    .map(() => worker());
  
  await Promise.all(workers);
  process.stdout.write('\n');
  return results;
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
Link Checker for Nextra Documentation

Usage:
  node scripts/check-links.mjs [options]

Options:
  --internal          Check internal links only (default if no flags specified)
  --external          Check external links only
  --all               Check both internal and external links
  --out=<file>        Write report to JSON file
  --report=<file>     Write report to Markdown file
  --concurrency=<n>   Number of concurrent external link checks (default: 5)
  --skip=<patterns>   Comma-separated list of strings to skip in external checks

Examples:
  node scripts/check-links.mjs --internal
  node scripts/check-links.mjs --external --concurrency=10 --skip="twitter.com,example.com"
  node scripts/check-links.mjs --all --report=link-report.md

Exit codes:
  0 - All links are valid
  1 - Broken links found
`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Show help
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }
  
  // Parse arguments
  const hasInternalFlag = args.includes('--internal');
  const hasExternalFlag = args.includes('--external');
  const hasAllFlag = args.includes('--all');
  
  const checkInternal = hasAllFlag || hasInternalFlag || (!hasInternalFlag && !hasExternalFlag);
  const checkExternal = hasAllFlag || hasExternalFlag;
  
  const outFile = args.find(arg => arg.startsWith('--out='))?.split('=')[1];
  const reportFile = args.find(arg => arg.startsWith('--report='))?.split('=')[1];
  const concurrency = parseInt(args.find(arg => arg.startsWith('--concurrency='))?.split('=')[1] || DEFAULT_CONCURRENCY.toString());
  
  const skipArg = args.find(arg => arg.startsWith('--skip='))?.split('=')[1];
  const skipPatterns = skipArg ? [...DEFAULT_SKIP_PATTERNS, ...skipArg.split(',')] : DEFAULT_SKIP_PATTERNS;
  
  console.log('Building route inventory...');
  const { routes } = buildRouteInventory();
  console.log(`Found ${routes.size} routes`);
  
  // Find all MDX files
  const mdxFiles = [
    ...glob.sync('app/**/*.mdx', { cwd: rootDir }),
  ].filter(file => !file.includes('node_modules'));
  
  // Find all _meta.js files
  const metaFiles = [
    ...glob.sync('app/**/_meta.js', { cwd: rootDir }),
  ].filter(file => !file.includes('node_modules'));
  
  console.log(`Found ${mdxFiles.length} MDX files and ${metaFiles.length} _meta.js files`);
  
  // Process all files
  console.log('Processing files and extracting links...');
  const fileResults = await Promise.all([
    ...mdxFiles.map(file => processFile(path.join(rootDir, file))),
    ...metaFiles.map(file => processMetaFile(path.join(rootDir, file)))
  ]);
  
  // Collect all links with their source files
  const allLinks = [];
  for (const fileResult of fileResults) {
    for (const link of fileResult.links) {
      allLinks.push({
        ...link,
        sourceFile: fileResult.file,
      });
    }
  }
  
  console.log(`Found ${allLinks.length} total links`);
  
  // Separate internal and external links
  const internalLinks = [];
  const externalLinks = [];
  
  for (const link of allLinks) {
    const url = link.url.trim();
    
    // Skip empty, mailto, tel, anchor-only links
    if (!url || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
      continue;
    }
    
    // Skip localhost links (they won't work in CI/CD)
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      continue;
    }
    
    // Skip template variables that weren't resolved
    if (url.includes('{{') || url.includes('{mainnetVersions') || url.includes('{mochaVersions')) {
      console.warn(`Warning: Unresolved template variable in ${link.sourceFile}: ${url}`);
      continue;
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      externalLinks.push(link);
    } else {
      internalLinks.push(link);
    }
  }
  
  const report = {
    summary: {
      totalLinks: allLinks.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      brokenInternal: 0,
      brokenExternal: 0,
    },
    internal: [],
    external: [],
    skipped: [],
  };
  
  // Check internal links
  if (checkInternal) {
    console.log(`\nChecking ${internalLinks.length} internal links...`);
    const checkedInternal = internalLinks.map(link => {
      const result = checkInternalLink(link.url, routes);
      return {
        ...link,
        ...result,
      };
    });
    
    const brokenInternal = checkedInternal.filter(l => !l.valid);
    report.summary.brokenInternal = brokenInternal.length;
    report.internal = brokenInternal.map(l => ({
      url: l.url,
      sourceFile: path.relative(rootDir, l.sourceFile),
      reason: l.reason || 'Unknown error',
    }));
    
    console.log(`Found ${brokenInternal.length} broken internal links`);
  }
  
  // Check external links
  if (checkExternal) {
    console.log(`\nChecking ${externalLinks.length} external links (concurrency: ${concurrency})...`);
    console.log(`Skipping patterns: ${skipPatterns.join(', ')}`);
    
    const checkedExternal = await processLinksConcurrently(
      externalLinks,
      async (link) => {
        const result = await checkExternalLink(link.url, skipPatterns);
        return result;
      },
      concurrency
    );
    
    const brokenExternal = checkedExternal.filter(l => !l.valid && !l.skipped);
    const skippedExternal = checkedExternal.filter(l => l.skipped);
    
    report.summary.brokenExternal = brokenExternal.length;
    report.external = brokenExternal.map(l => ({
      url: l.url,
      sourceFile: path.relative(rootDir, l.sourceFile),
      status: l.status,
      statusText: l.statusText,
      error: l.error,
    }));
    
    report.skipped = skippedExternal.map(l => ({
       url: l.url,
       sourceFile: path.relative(rootDir, l.sourceFile),
       reason: l.reason
    }));
    
    console.log(`Found ${brokenExternal.length} broken external links`);
    console.log(`Skipped ${skippedExternal.length} links`);
  }
  
  // Generate JSON report
  if (outFile) {
    fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
    console.log(`\nJSON report written to ${outFile}`);
  }
  
  // Generate Markdown report
  if (reportFile) {
    let mdContent = `# Link Check Report\n\n`;
    mdContent += `**Date:** ${new Date().toLocaleString()}\n`;
    mdContent += `**Total Links:** ${report.summary.totalLinks}\n`;
    mdContent += `**Internal Broken:** ${report.summary.brokenInternal}\n`;
    mdContent += `**External Broken:** ${report.summary.brokenExternal}\n\n`;
    
    if (report.internal.length > 0) {
      mdContent += `## Broken Internal Links\n\n`;
      mdContent += `| Source File | URL | Reason |\n`;
      mdContent += `|---|---|---|\n`;
      report.internal.forEach(l => {
        mdContent += `| \`${l.sourceFile}\` | \`${l.url}\` | ${l.reason} |\n`;
      });
      mdContent += `\n`;
    }
    
    if (report.external.length > 0) {
      mdContent += `## Broken External Links\n\n`;
      mdContent += `| Source File | URL | Status | Error |\n`;
      mdContent += `|---|---|---|---|\n`;
      report.external.forEach(l => {
        mdContent += `| \`${l.sourceFile}\` | ${l.url} | ${l.status || '-'} | ${l.error || l.statusText} |\n`;
      });
      mdContent += `\n`;
    }

    if (report.skipped.length > 0) {
        mdContent += `## Skipped Links\n\n`;
        mdContent += `<details><summary>Click to expand (${report.skipped.length})</summary>\n\n`;
        mdContent += `| Source File | URL | Reason |\n`;
        mdContent += `|---|---|---|\n`;
        report.skipped.forEach(l => {
            mdContent += `| \`${l.sourceFile}\` | ${l.url} | ${l.reason} |\n`;
        });
        mdContent += `\n</details>\n`;
    }
    
    fs.writeFileSync(reportFile, mdContent);
    console.log(`Markdown report written to ${reportFile}`);
  } 
  
  // Print console summary if no output files specified OR as a general summary
  // We always print this now for CI logs visibility
  console.log('\n=== LINK CHECK SUMMARY ===\n');
  console.log(`Total Links: ${report.summary.totalLinks}`);
  console.log(`Internal: ${report.summary.internalLinks} (Broken: ${report.summary.brokenInternal})`);
  console.log(`External: ${report.summary.externalLinks} (Broken: ${report.summary.brokenExternal})`);
  
  if (report.summary.brokenInternal > 0) {
    console.log('\n--- Broken Internal Links ---');
    report.internal.forEach(l => {
      console.log(`[${l.reason}] ${l.url} (in ${l.sourceFile})`);
    });
  }
  
  if (report.summary.brokenExternal > 0) {
    console.log('\n--- Broken External Links ---');
    report.external.forEach(l => {
      console.log(`[${l.status || 'ERR'} - ${l.error || l.statusText}] ${l.url} (in ${l.sourceFile})`);
    });
  }
  console.log('\n==========================\n');
  
  // Exit with error code if broken links found
  const totalBroken = report.summary.brokenInternal + report.summary.brokenExternal;
  if (totalBroken > 0) {
    console.error(`\n❌ Found ${totalBroken} broken links`);
    process.exit(1);
  } else {
    console.log('\n✅ All links are valid!');
    process.exit(0);
  }
}

// Run main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
