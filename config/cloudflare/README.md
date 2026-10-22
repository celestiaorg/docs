# Agent readiness at the edge

Cloudflare Pages runs `worker/index.js` alongside the static documentation.
The Worker serves each generated `.md` file at its normal page URL when the
client prefers `Accept: text/markdown`. Browsers receive HTML. It also supplies
HTTP discovery `Link` headers and the RFC 9727 API catalog media type.
No paid Markdown converter or separate configuration rule is needed.

Follow the [cutover runbook](../../.github/CLOUDFLARE-CUTOVER.md) to move
`docs.celestia.org` from GitHub Pages. Merging code does not switch that domain.

## Verify the deployment

```bash
node scripts/check-cloudflare-deployment.mjs https://docs.celestia.org
```

The smoke test checks real pages, assets, MCP tools, the API catalog, and
HTML → Markdown → HTML requests to the homepage and a nested Go guide.
Negotiated Markdown must match the static `.md` file, with `Content-Type:
text/markdown` and `Vary: Accept`. Successful HTML responses use `Cache-Control:
private, no-cache`: browsers may store HTML and revalidate it with the asset ETag
before reuse. Negotiated Markdown and HTML errors keep `private, no-store`.
Shared caches must not store either representation at negotiated URLs;
`Vary: Accept` alone does not isolate the Cloudflare cache. Pages source assets
retain their normal caching. Explicit `.md` URLs remain available.

Run a fresh [Content Site scan](https://isitagentready.com/docs.celestia.org?profile=content)
and [Is Agentic scan](https://is-agentic.com/scan/docs.celestia.org) after cutover.
Record timestamps and failed requests alongside scores. These scanners measure
different capabilities; local tests do not establish production scores.

## Existing GitHub Pages rules

The two JSON files are rollback inputs for the old GitHub Pages origin:

- [discovery-headers.json](discovery-headers.json) adds discovery `Link` headers.
- [api-catalog-content-type.json](api-catalog-content-type.json) sets the RFC 9727
  media type on successful `/.well-known/api-catalog` responses.

Once the Pages Worker serves the custom domain, disable only these two redundant
hostname-scoped rules using the IDs recorded during their deployment. Verify the
smoke test again. Keep their IDs and payloads so a rollback to GitHub Pages can
restore the headers. Do not replace a zone ruleset or change unrelated rules.

## Crawler challenges and optional capabilities

If a scanner reports a challenge or HTTP 403, Cris should inspect Cloudflare
Security Events for its timestamp, hostname, path and Ray ID. Identify the rule
responsible and make a targeted correction, then rescan. A `robots.txt` allow
entry does not bypass a challenge, and waiting for DNS cannot fix a WAF rule.

This public documentation site has no sign-in, protected API, registration or
checkout. OAuth metadata, Auth.md and payment protocols do not apply. The Node
API uses OpenRPC; do not publish fictional REST operations for scanner points.
The Pages deployment has real read-only MCP tools at `/mcp` and `/api/mcp`.
Its server card is at `/mcp/server-card`, linked from `/.well-known/ai-catalog.json`.
Browsers that implement WebMCP expose documentation search and current-page
retrieval using the same public files. DNS publication remains an owner task;
see the [DNS-AID handoff](DNS-AID.md) for the proposed record and DNSSEC checks.

## Interpreting the October 2026 readiness findings

The production smoke test passed on 22 October 2026 before this follow-up.
The two supplied Journey reports found a working Go integration path, but one
missed MCP discovery and needed several pages to assemble setup requirements.
The blob overview now supplies the setup checklist, and the developer portal,
LLM index and community directory link the dedicated documentation MCP guide.

- **JSON errors:** 404/405 problem details already worked in production. The
  follow-up extends JSON negotiation to non-JSON upstream 4xx/5xx errors,
  preserving status codes and existing retry headers. Errors generated before
  the Worker, including WAF challenges, remain an edge configuration concern.
- **Pricing:** `/pricing` redirects to `/build/pricing/`. The page distinguishes
  free documentation/MCP from network fees and separately priced providers.
- **REST error schema:** all 120 operations in the inspected production
  `/openapi.json` already referenced typed `rpcStatus` default responses.
  Swagger 2.0 `default` covers statuses without an explicit response entry.
  Preserve upstream schemas and release automation; do not claim the provider
  REST API uses the docs Worker's RFC 9457 shape.
- **Rate limits:** preserve real upstream headers and document retry behaviour.
  Publishing quota counters requires an actual limiting policy and consistent
  counters. Adding a new limiter would change public product behaviour; choose
  limits, scope, and ownership before implementing one. Provider quotas belong
  to the provider, and WAF-generated responses need edge configuration.
- **MCP server card:** the scanner skill still describes the older proposal's
  `serverInfo`/`capabilities` shape and well-known path. The final
  [SEP-2127](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2127-mcp-server-cards.md)
  uses identity fields and `remotes`, recommends `<mcp-url>/server-card`, and
  deliberately leaves capabilities to live negotiation. Keep the current format.
- **OAuth/OIDC and Auth.md:** there is no docs sign-in, issuer, protected API,
  or registration flow to describe. Adding fictional issuer/token endpoints
  would mislead agents. If a protected service is introduced, its owner must
  choose the issuer, real endpoints, scopes and provisioning flow first.

Use the current protocols and verify deployed behaviour before interpreting
another scanner run. Do not claim an improved score from local tests.
