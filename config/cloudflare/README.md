# Agent readiness at the edge

Enable Markdown negotiation and discovery response headers on
`docs.celestia.org` using Cloudflare's native rules. GitHub Pages remains the
origin. These files are deployment inputs, not automatically applied settings.

The production scan on 15 October 2026 at 22:21 UTC passed four of the seven
Cloudflare Content Site checks (57/100, level 2). Markdown negotiation, HTTP
`Link` headers, and DNS-AID failed. Rescan after deployment; do not treat local
validation or a merged PR as proof of a higher production score.

## Enable Markdown negotiation

In the `celestia.org` zone, go to **Rules > Overview > Create rule >
Configuration Rules**. Match `http.host eq "docs.celestia.org"`, add the
**Markdown for Agents** setting, and turn it on. Save the rule ID for rollback.
The equivalent single-rule API payload is
[markdown-negotiation.json](markdown-negotiation.json), for the
`http_config_settings` phase.

[Cloudflare's setup documentation](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/#how-to-enable)
lists supported plans. Use the hostname-specific rule so other Celestia sites
keep their existing behaviour. Cloudflare converts HTML on demand and sets
`Content-Type: text/markdown` and `Vary: Accept`. The existing generated `.md`
files remain available independently; the converted representation can differ.

## Add discovery response headers

Create a **Response Header Transform Rule** matching
`http.host eq "docs.celestia.org"`. For header `Link`, use **Add static** with
the value in [discovery-headers.json](discovery-headers.json). Adding preserves
any existing `Link` headers. The API phase is `http_response_headers_transform`.

For either API payload, retrieve the existing phase entry point ruleset first.
[Append the single rule](https://developers.cloudflare.com/ruleset-engine/rulesets-api/add-rule/)
with `POST /zones/<zone_id>/rulesets/<ruleset_id>/rules`. If the rule's `ref`
already exists, update that rule instead of adding a duplicate. If no phase
entry point exists, create it through the dashboard. Do not replace an entire
zone ruleset with these single-rule files. Check ordering against existing
rules before deploying. See the
[response header rule documentation](https://developers.cloudflare.com/rules/transform/response-header-modification/create-dashboard/).

## Verify and roll back

Fetch both representations and follow redirects:

```bash
curl -fsSL -D /tmp/celestia-markdown.headers \
  -H 'Accept: text/markdown' https://docs.celestia.org/ \
  -o /tmp/celestia-markdown.md
curl -fsSL -D /tmp/celestia-html.headers \
  -H 'Accept: text/html' https://docs.celestia.org/ \
  -o /tmp/celestia-html.html
```

The final Markdown response must be nonempty Markdown, have `Content-Type:
text/markdown`, and include `Accept` in `Vary`. The HTML request must still
return HTML. Both must advertise the API catalog and LLM resources in `Link`.
Repeat with `/build/post-retrieve-blob/client/go/` and check its code examples
and links. Request HTML again after Markdown to check for mixed cached variants.
Keep the explicit `.md` links if conversion loses useful documentation content.

Run a fresh scan with the exact Content Site checks:

```bash
curl -fsS https://isitagentready.com/api/scan \
  -H 'Content-Type: application/json' \
  --data '{"url":"https://docs.celestia.org","enabledChecks":["robotsTxt","sitemap","linkHeaders","dnsAid","markdownNegotiation","robotsTxtAiRules","contentSignals"]}'
```

Verify `checks.contentAccessibility.markdownNegotiation.status` and
`checks.discoverability.linkHeaders.status` are `pass`. Read the timestamp and
evidence, then compare the [Content Site report](https://isitagentready.com/docs.celestia.org?profile=content)
and [Is Agentic report](https://is-agentic.com/scan/docs.celestia.org).
To roll back, disable only the two rules created above. Confirm HTML and the
existing static Markdown URLs still work.

## Review every scanner suggestion

| Suggestion | Treatment for this documentation site |
| --- | --- |
| robots.txt, sitemap, AI bot rules, Content Signals | Already generated and covered by `yarn test:llms`. |
| Markdown negotiation | Enable the configuration rule above. |
| HTTP Link headers | Enable the response header rule above. |
| DNS-AID | Deferred until there is a real agent endpoint to advertise. The [DNS-AID reference implementation](https://github.com/dns-aid/dns-aid-core) discovers agent services; a documentation skill file is not an MCP or A2A server. Do not publish a service record claiming one exists. |
| API catalog, Agent Skills, ARD | Already generated with real OpenRPC specs and the Celestia skill. |
| Personal Agent Protocol | The generator publishes `/.well-known/poppy.json` as a website-only declaration under [draft 0.1](https://personalagentprotocol.org/docs/spec#3-discovery). This informational check does not raise Cloudflare's score. |
| OAuth/OIDC discovery, OAuth Protected Resource Metadata, Auth.md registration | Not applicable: the docs site has no sign-in, protected API, or agent registration service. Node/provider credentials belong to those services, not this domain. |
| MCP Server Card, A2A Agent Card | No official docs agent server exists. Publish cards only alongside a working server. |
| WebMCP | Optional new browser-tool functionality; the site currently exposes static Markdown and Pagefind search. Do not register placeholder tools merely for scanner detection. |
| Web Bot Auth | The request-signing check is informational and concerns agents making requests. Publishing a signing directory would claim an identity this site does not operate. |
| x402, MPP, UCP, ACP, AP2 | Not applicable: public documentation has no checkout or paid resource access. |

DNS-AID remains a failed Content Site check until a suitable service exists.
Passing the two edge checks would yield six of seven Content Site checks
(86/100) under the observed scoring rules; only a new scan confirms the result.

## Investigate crawler challenges

If Is Agentic reports a challenge or HTTP 403, inspect Cloudflare Security
Events for the scan time, hostname, path, and returned Ray IDs. Identify the
specific rule or product responsible before changing it. A User-Agent allow
entry in `robots.txt` does not bypass a challenge, and a spoofed crawler name
does not prove a verified bot's identity. Check the homepage, sitemap, and
sampled `.md` URLs from the scanner's own network after any targeted correction.
Do not disable zone-wide protection to improve a score.
