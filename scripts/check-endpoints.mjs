#!/usr/bin/env node

/**
 * Community endpoint health checker.
 *
 * Parses the three network MDX pages (mainnet-beta, mocha-testnet,
 * arabica-devnet), extracts community endpoints, checks reachability,
 * and removes unreachable endpoints from the files.
 *
 * Exit codes:
 *   0 — all endpoints reachable (or removals written successfully)
 *   1 — fatal error
 */

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const NETWORK_FILES = [
  "app/operate/networks/mainnet-beta/page.mdx",
  "app/operate/networks/mocha-testnet/page.mdx",
  "app/operate/networks/arabica-devnet/page.mdx",
];

const TCP_TIMEOUT_MS = 10_000;
const HTTP_TIMEOUT_MS = 15_000;
const CONCURRENCY = 6;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** True if the endpoint string contains MDX template variables. */
function hasTemplateVar(s) {
  return /\{\{|{constants/.test(s);
}

function getEndpointHost(raw) {
  const value = raw.trim();
  if (/^https?:\/\//i.test(value) || /^wss?:\/\//i.test(value)) {
    try {
      return new URL(value).hostname.toLowerCase();
    } catch {
      return "";
    }
  }

  const withoutPath = value.split("/")[0];
  if (withoutPath.startsWith("[")) {
    const ipv6Match = withoutPath.match(/^\[([^\]]+)\](?::\d+)?$/);
    return ipv6Match ? ipv6Match[1].toLowerCase() : "";
  }

  const [host] = withoutPath.split(":");
  return host.toLowerCase();
}

function matchesHostname(hostname, suffix) {
  return hostname === suffix || hostname.endsWith(`.${suffix}`);
}

/** True for Celestia-operated (non-community) hostnames. */
function isOfficialEndpoint(s) {
  const hostname = getEndpointHost(s);
  return [
    "celestia-mocha.com",
    "celestia-arabica-11.com",
    "celestia.com",
    "quicknode.com",
  ].some((suffix) => matchesHostname(hostname, suffix));
}

/** TCP connect check. Resolves true (ok) or false (failed). */
function checkTcp(host, port) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    sock.setTimeout(TCP_TIMEOUT_MS);
    sock.once("connect", () => {
      sock.destroy();
      resolve(true);
    });
    sock.once("timeout", () => {
      sock.destroy();
      resolve(false);
    });
    sock.once("error", () => {
      sock.destroy();
      resolve(false);
    });
    sock.connect(port, host);
  });
}

/** HTTP(S) health check. Resolves true if status < 400. Falls back to GET if HEAD fails. */
async function checkHttp(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        redirect: "follow",
      });
      clearTimeout(timer);
      if (res.status < 400) return true;
    } catch {
      // try next method
    }
  }
  return false;
}

/** Run an array of async fns with bounded concurrency. */
async function pMap(items, fn, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

// ---------------------------------------------------------------------------
// Endpoint extraction
// ---------------------------------------------------------------------------

/**
 * Extract community endpoints from a Mocha-style bullet-list MDX file.
 *
 * Looks for sections like:
 *   ## Community RPC endpoints
 *   ## Community API endpoints
 *   ## Community gRPC endpoints
 * and lines matching:  - `<endpoint>`
 *
 * Also covers:
 *   ### Community Data availability (DA) RPC endpoints ...
 *   ### Community Data availability (DA) gRPC endpoints ...
 */
function extractMochaBulletEndpoints(content) {
  const endpoints = [];
  const lines = content.split("\n");
  let inCommunitySection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect community section headers
    if (/^#{2,3}\s+Community\b/i.test(line)) {
      inCommunitySection = true;
      continue;
    }
    // A new heading of equal or higher level ends the section
    if (inCommunitySection && /^#{1,3}\s+/.test(line) && !/^#{2,3}\s+Community\b/i.test(line)) {
      // Check if it's a sub-heading within the community section
      if (/^#{4,}\s+/.test(line)) continue; // deeper subheading, stay in section
      inCommunitySection = false;
      continue;
    }
    if (!inCommunitySection) continue;

    // Match bullet list endpoints:  - `endpoint` or - `endpoint`
    const m = line.match(/^-\s+`([^`]+)`/);
    if (!m) continue;
    const raw = m[1];
    if (hasTemplateVar(raw) || isOfficialEndpoint(raw)) continue;
    endpoints.push({ raw, lineIndex: i, line });
  }
  return endpoints;
}

/**
 * Extract community endpoints from a Mainnet-style table MDX file.
 *
 * Looks for the "### Community consensus endpoints" section and parses
 * the markdown table rows. Each row has:
 *   | Provider | RPC | API | gRPC | WebSocket |
 */
function extractMainnetTableEndpoints(content) {
  const endpoints = [];
  const lines = content.split("\n");
  let inSection = false;
  let headerParsed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^#{2,3}\s+Community consensus endpoints/i.test(line)) {
      inSection = true;
      headerParsed = false;
      continue;
    }
    if (inSection && /^#{1,3}\s+/.test(line) && !/^#{4,}\s+/.test(line)) {
      inSection = false;
      continue;
    }
    if (!inSection) continue;

    // Skip non-table lines, header row, and separator row
    if (!line.startsWith("|")) continue;
    if (!headerParsed) {
      // First table row is the header
      if (/Provider/i.test(line)) {
        headerParsed = true; // next pipe-row is separator, then data
      }
      continue;
    }
    // Skip separator row
    if (/^\|\s*[-:]+/.test(line)) continue;

    // Parse table cells
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 4) continue;

    // cells: [provider, rpc, api, grpc, ws?]
    const rowEndpoints = [];
    for (let ci = 1; ci < cells.length; ci++) {
      const m = cells[ci].match(/`([^`]+)`/);
      if (!m) continue;
      const raw = m[1];
      if (hasTemplateVar(raw) || isOfficialEndpoint(raw) || raw === "-") continue;
      rowEndpoints.push(raw);
    }
    if (rowEndpoints.length > 0) {
      endpoints.push({ lineIndex: i, line, rawEndpoints: rowEndpoints, provider: cells[0] });
    }
  }
  return endpoints;
}

/**
 * Extract community endpoints from the Arabica table format.
 *
 * The table has:  | Node type | Endpoint type | Endpoint |
 */
function extractArabicaTableEndpoints(content) {
  const endpoints = [];
  const lines = content.split("\n");
  let inSection = false;
  let pastHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^#{2,3}\s+Community RPC endpoints/i.test(line)) {
      inSection = true;
      pastHeader = false;
      continue;
    }
    if (inSection && /^#{1,3}\s+/.test(line) && !/^#{4,}\s+/.test(line)) {
      inSection = false;
      continue;
    }
    if (!inSection) continue;
    if (!line.startsWith("|")) continue;

    if (!pastHeader) {
      if (/Node type|Endpoint type/i.test(line)) {
        pastHeader = true;
      }
      continue;
    }
    if (/^\|\s*[-:]+/.test(line)) continue;

    // Extract backtick-wrapped endpoints from the row
    const rowEndpoints = [];
    const re = /`([^`]+)`/g;
    let match;
    while ((match = re.exec(line)) !== null) {
      const raw = match[1];
      if (hasTemplateVar(raw) || isOfficialEndpoint(raw)) continue;
      // Skip things that aren't endpoints (e.g. "–core.ip string")
      if (/^\-\-/.test(raw) || /^celestia\s/.test(raw)) continue;
      rowEndpoints.push(raw);
    }
    if (rowEndpoints.length > 0) {
      endpoints.push({ lineIndex: i, line, rawEndpoints: rowEndpoints });
    }
  }
  return endpoints;
}

// ---------------------------------------------------------------------------
// Endpoint → check descriptor
// ---------------------------------------------------------------------------

/**
 * Given a raw endpoint string, return { host, port, type } for checking.
 *   - `https://...`  →  type: "http"
 *   - `wss://...`    →  type: "ws" (tcp on 443)
 *   - `host:port`    →  type: "tcp"
 *   - `host`         →  type: "tcp" on port 26657
 */
function resolveCheck(raw) {
  if (/^https?:\/\//i.test(raw)) {
    // Normalise: ensure trailing-slash-less URL works with HEAD
    const url = raw.replace(/\/+$/, "");
    return { type: "http", url, label: raw };
  }
  if (/^wss?:\/\//i.test(raw)) {
    // WebSocket endpoints: check via HTTPS since they need an HTTP upgrade handshake
    const httpUrl = raw.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
    return { type: "http", url: httpUrl, label: raw };
  }
  // host:port
  const colonMatch = raw.match(/^([^:]+):(\d+)(.*)$/);
  if (colonMatch) {
    return { type: "tcp", host: colonMatch[1], port: Number(colonMatch[2]), label: raw };
  }
  // bare host — default RPC port
  return { type: "tcp", host: raw, port: 26657, label: raw };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const removals = []; // { network, endpoint, file }

  for (const relPath of NETWORK_FILES) {
    const absPath = path.join(ROOT, relPath);
    let fileHandle;
    try {
      fileHandle = await fs.promises.open(absPath, "r+");
    } catch (error) {
      if (error?.code === "ENOENT") {
        console.log(`Skipping ${relPath} (file not found)`);
        continue;
      }
      throw error;
    }

    try {
      const content = await fileHandle.readFile({ encoding: "utf-8" });
      const networkName = relPath.includes("mainnet")
        ? "mainnet-beta"
        : relPath.includes("mocha")
          ? "mocha-testnet"
          : "arabica-devnet";

      console.log(`\n=== ${networkName} ===`);

      // --- Determine parser based on network ---
      let checkItems; // { raw, lineIndex, line, check }[]

      if (networkName === "mocha-testnet") {
        const eps = extractMochaBulletEndpoints(content);
        checkItems = eps.map((ep) => ({
          ...ep,
          check: resolveCheck(ep.raw),
          rowEndpoints: [ep.raw],
        }));
      } else if (networkName === "mainnet-beta") {
        const rows = extractMainnetTableEndpoints(content);
        checkItems = [];
        for (const row of rows) {
          for (const raw of row.rawEndpoints) {
            checkItems.push({
              raw,
              lineIndex: row.lineIndex,
              line: row.line,
              provider: row.provider,
              check: resolveCheck(raw),
              rowEndpoints: row.rawEndpoints,
            });
          }
        }
      } else {
        // arabica
        const rows = extractArabicaTableEndpoints(content);
        checkItems = [];
        for (const row of rows) {
          for (const raw of row.rawEndpoints) {
            checkItems.push({
              raw,
              lineIndex: row.lineIndex,
              line: row.line,
              check: resolveCheck(raw),
              rowEndpoints: row.rawEndpoints,
            });
          }
        }
      }

      if (checkItems.length === 0) {
        console.log("  No community endpoints found to check.");
        continue;
      }

      console.log(`  Found ${checkItems.length} community endpoint(s) to check.`);

      // --- Check endpoints ---
      const results = await pMap(
        checkItems,
        async (item) => {
          const { check } = item;
          let ok;
          if (check.type === "http") {
            ok = await checkHttp(check.url);
          } else {
            ok = await checkTcp(check.host, check.port);
          }
          const status = ok ? "OK" : "FAILED";
          console.log(`  ${status}: ${check.label}`);
          return { ...item, ok };
        },
        CONCURRENCY,
      );

      // --- Collect failed endpoints ---
      const failed = results.filter((r) => !r.ok);
      if (failed.length === 0) {
        console.log("  All endpoints reachable.");
        continue;
      }

      // Group by lineIndex
      const failedByLine = new Map();
      const allByLine = new Map();
      for (const r of results) {
        if (!allByLine.has(r.lineIndex)) allByLine.set(r.lineIndex, []);
        allByLine.get(r.lineIndex).push(r);
      }
      for (const r of failed) {
        if (!failedByLine.has(r.lineIndex)) failedByLine.set(r.lineIndex, []);
        failedByLine.get(r.lineIndex).push(r);
      }

      // --- Apply fixes per line ---
      const lines = content.split("\n");
      const linesToRemove = new Set();
      let edits = 0;

      for (const [lineIndex, lineFailures] of failedByLine) {
        const lineAll = allByLine.get(lineIndex);
        const allFailed = lineAll.every((r) => !r.ok);

        if (allFailed) {
          // Every endpoint in this line/row is down — remove the whole line
          linesToRemove.add(lineIndex);
        } else {
          // Partial failure in a table row — replace broken cells with `-`
          let edited = lines[lineIndex];
          for (const r of lineFailures) {
            edited = edited.replace("`" + r.raw + "`", "-");
          }
          lines[lineIndex] = edited;
        }

        for (const r of lineFailures) {
          removals.push({ network: networkName, endpoint: r.raw, file: relPath });
        }
        edits++;
      }

      const newLines = lines.filter((_, idx) => !linesToRemove.has(idx));
      await fileHandle.truncate(0);
      await fileHandle.write(newLines.join("\n"), 0, "utf-8");
      console.log(
        `  Fixed ${edits} line(s) in ${relPath} (${linesToRemove.size} removed, ${edits - linesToRemove.size} edited)`,
      );
    } finally {
      await fileHandle.close();
    }
  }

  // --- Summary ---
  if (removals.length === 0) {
    console.log("\nAll community endpoints are reachable. No changes made.");
  } else {
    console.log(`\n=== Summary: ${removals.length} endpoint(s) removed ===`);
    const summary = removals.map((r) => `- [${r.network}] ${r.endpoint}`).join("\n");
    console.log(summary);

    // Write summary to a file for the workflow to read
    const summaryPath = path.join(ROOT, "endpoint-check-summary.txt");
    fs.writeFileSync(summaryPath, summary);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
