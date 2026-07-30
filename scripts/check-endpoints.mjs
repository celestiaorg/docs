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

function inferEndpointKind(value, fallback = "rpc") {
  const lower = value.toLowerCase();
  if (/websocket|wss?:/.test(lower)) return "websocket";
  if (/\bgrpc\b/.test(lower)) return "grpc";
  if (/\bapi\b|\blcd\b|\brest\b/.test(lower)) return "api";
  if (/\brpc\b|\bconsensus\b/.test(lower)) return "rpc";
  return fallback;
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

/** HTTP(S) reachability check. Resolves true when the server returns any HTTP response. */
async function checkHttp(url) {
  for (const method of ["HEAD", "GET"]) {
    let timer;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
      await fetch(url, {
        method,
        signal: controller.signal,
        redirect: "follow",
      });
      return true;
    } catch {
      // try next method
    } finally {
      clearTimeout(timer);
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
  let endpointKind = "rpc";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect community section headers
    if (/^#{2,3}\s+Community\b/i.test(line)) {
      inCommunitySection = true;
      endpointKind = inferEndpointKind(line, endpointKind);
      continue;
    }
    // A new heading of equal or higher level ends the section
    if (inCommunitySection && /^#{1,3}\s+/.test(line) && !/^#{2,3}\s+Community\b/i.test(line)) {
      inCommunitySection = false;
      continue;
    }
    if (!inCommunitySection) continue;

    // Match bullet list endpoints:  - `endpoint` or - `endpoint`
    const m = line.match(/^-\s+`([^`]+)`/);
    if (!m) continue;
    const raw = m[1];
    if (hasTemplateVar(raw) || isOfficialEndpoint(raw)) continue;
    endpoints.push({
      raw,
      lineIndex: i,
      line,
      endpointKind: inferEndpointKind(raw, endpointKind),
    });
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
    const endpointKinds = ["rpc", "api", "grpc", "websocket"];
    const endpointEntries = [];
    for (let ci = 1; ci < cells.length; ci++) {
      const m = cells[ci].match(/`([^`]+)`/);
      if (!m) continue;
      const raw = m[1];
      if (hasTemplateVar(raw) || isOfficialEndpoint(raw) || raw === "-") continue;
      endpointEntries.push({ raw, endpointKind: endpointKinds[ci - 1] ?? "rpc" });
    }
    if (endpointEntries.length > 0) {
      endpoints.push({ lineIndex: i, line, endpointEntries, provider: cells[0] });
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
  let endpointKind = "rpc";

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

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells[1]) endpointKind = inferEndpointKind(cells[1], endpointKind);

    // Extract backtick-wrapped endpoints from the row
    const endpointEntries = [];
    const re = /`([^`]+)`/g;
    let match;
    while ((match = re.exec(line)) !== null) {
      const raw = match[1];
      if (hasTemplateVar(raw) || isOfficialEndpoint(raw)) continue;
      // Skip things that aren't endpoints (e.g. "–core.ip string")
      if (/^\-\-/.test(raw) || /^celestia\s/.test(raw)) continue;
      endpointEntries.push({ raw, endpointKind });
    }
    if (endpointEntries.length > 0) {
      endpoints.push({ lineIndex: i, line, endpointEntries });
    }
  }
  return endpoints;
}

// ---------------------------------------------------------------------------
// Endpoint → check descriptor
// ---------------------------------------------------------------------------

/**
 * Given a raw endpoint string and endpoint kind, return a descriptor for checking.
 *   - HTTP(S)/API endpoints  →  HTTP reachability probe
 *   - WebSocket endpoints    →  HTTP reachability probe against the upgrade URL
 *   - `host:port`            →  TCP probe, except scheme-less API endpoints
 *   - bare RPC host          →  TCP probe on port 26657
 *   - bare gRPC host         →  TCP probe on port 9090
 */
function getExplicitPort(raw) {
  const value = raw.trim();
  if (/^https?:\/\//i.test(value) || /^wss?:\/\//i.test(value)) {
    try {
      const port = new URL(value).port;
      return port ? Number(port) : null;
    } catch {
      return null;
    }
  }

  const withoutPath = value.split("/")[0];
  const ipv6Match = withoutPath.match(/^\[[^\]]+\]:(\d+)$/);
  if (ipv6Match) return Number(ipv6Match[1]);

  const portMatch = withoutPath.match(/^[^:]+:(\d+)$/);
  return portMatch ? Number(portMatch[1]) : null;
}

function toHttpUrl(raw) {
  const value = raw.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(raw)) {
    return value;
  }

  const port = getExplicitPort(value);
  const scheme = port && port !== 443 ? "http" : "https";
  return `${scheme}://${value}`;
}

function resolveCheck(raw, endpointKind = "rpc") {
  if (/^wss?:\/\//i.test(raw)) {
    // WebSocket endpoints: check via HTTP since they need an HTTP upgrade handshake.
    const httpUrl = raw.replace(/^wss:/i, "https:").replace(/^ws:/i, "http:");
    return { type: "http", url: httpUrl, label: raw };
  }

  if (/^https?:\/\//i.test(raw) || endpointKind === "api") {
    return { type: "http", url: toHttpUrl(raw), label: raw };
  }

  // host:port
  const colonMatch = raw.match(/^([^:]+):(\d+)(.*)$/);
  if (colonMatch) {
    return { type: "tcp", host: colonMatch[1], port: Number(colonMatch[2]), label: raw };
  }

  const defaultPort = endpointKind === "grpc" ? 9090 : 26657;
  return { type: "tcp", host: raw, port: defaultPort, label: raw };
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
          check: resolveCheck(ep.raw, ep.endpointKind),
          rowEndpoints: [ep.raw],
        }));
      } else if (networkName === "mainnet-beta") {
        const rows = extractMainnetTableEndpoints(content);
        checkItems = [];
        for (const row of rows) {
          for (const entry of row.endpointEntries) {
            checkItems.push({
              raw: entry.raw,
              endpointKind: entry.endpointKind,
              lineIndex: row.lineIndex,
              line: row.line,
              provider: row.provider,
              check: resolveCheck(entry.raw, entry.endpointKind),
              rowEndpoints: row.endpointEntries.map((ep) => ep.raw),
            });
          }
        }
      } else {
        // arabica
        const rows = extractArabicaTableEndpoints(content);
        checkItems = [];
        for (const row of rows) {
          for (const entry of row.endpointEntries) {
            checkItems.push({
              raw: entry.raw,
              endpointKind: entry.endpointKind,
              lineIndex: row.lineIndex,
              line: row.line,
              check: resolveCheck(entry.raw, entry.endpointKind),
              rowEndpoints: row.endpointEntries.map((ep) => ep.raw),
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
      let removedRows = 0;
      let editedRows = 0;

      for (const [lineIndex, lineFailures] of failedByLine) {
        const lineAll = allByLine.get(lineIndex);
        const allFailed = lineAll.every((r) => !r.ok);

        if (allFailed) {
          // Every endpoint in this line/row is down — remove the whole line
          linesToRemove.add(lineIndex);
          if (networkName === "mocha-testnet") {
            let next = lineIndex + 1;
            while (next < lines.length && /^\s+-/.test(lines[next])) {
              linesToRemove.add(next);
              next++;
            }
          }
          removedRows++;
        } else {
          // Partial failure in a table row — replace broken cells with `-`
          let edited = lines[lineIndex];
          for (const r of lineFailures) {
            edited = edited.replace("`" + r.raw + "`", "-");
          }
          lines[lineIndex] = edited;
          editedRows++;
        }

        for (const r of lineFailures) {
          removals.push({ network: networkName, endpoint: r.raw, file: relPath });
        }
      }

      const newLines = lines.filter((_, idx) => !linesToRemove.has(idx));
      await fileHandle.truncate(0);
      await fileHandle.write(newLines.join("\n"), 0, "utf-8");
      console.log(
        `  Fixed ${removedRows + editedRows} row(s) in ${relPath} (${linesToRemove.size} line(s) removed, ${editedRows} row(s) edited)`,
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
