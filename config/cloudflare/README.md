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

For each API payload, retrieve the existing phase entry point ruleset first.
[Append the single rule](https://developers.cloudflare.com/ruleset-engine/rulesets-api/add-rule/)
with `POST /zones/<zone_id>/rulesets/<ruleset_id>/rules`. If the rule's `ref`
already exists, update that rule instead of adding a duplicate. If no phase
entry point exists, create it through the dashboard. Do not replace an entire
zone ruleset with these single-rule files. Check ordering against existing
rules before deploying. See the
[response header rule documentation](https://developers.cloudflare.com/rules/transform/response-header-modification/create-dashboard/).

## Set the API catalog media type

GitHub Pages serves the extensionless `/.well-known/api-catalog` file as
`application/octet-stream`. Add a separate Response Header Transform Rule using
[api-catalog-content-type.json](api-catalog-content-type.json). It sets
`Content-Type: application/linkset+json` with the RFC 9727 profile only for HTTP
200 responses at that exact path and hostname. It does not relabel errors or
other pages. Use the same append-or-update procedure above in the
`http_response_headers_transform` phase.

[RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html#section-4.2) requires the
Linkset format. A valid JSON body alone does not fix the response media type.

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

Check the catalog's final media type and parse its body:

```bash
curl -fsSL -D /tmp/celestia-catalog.headers \
  -H 'Accept: application/linkset+json' \
  https://docs.celestia.org/.well-known/api-catalog \
  -o /tmp/celestia-catalog.json
python3 -m json.tool /tmp/celestia-catalog.json
```

Confirm `Content-Type: application/linkset+json` and the RFC 9727 profile in
`/tmp/celestia-catalog.headers`. These are deployment checks; the repository
cannot verify a Cloudflare rule is enabled without observing public responses.

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
To roll back, disable only the rules created above. Confirm HTML and the
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

## Is Agentic audit follow-up

The supplied 8/100 report combines content checks with hosted-API checks. The
following maps all 17 findings to this static documentation site. Do not infer
an updated score from source changes.

| Audit findings | Resolution or remaining owner |
| --- | --- |
| 1. Content without JavaScript | The homepage exports meaningful product guidance and the existing four navigation cards as HTML and Markdown. Tests require at least 500 characters of prose, one H1, and sequential H2 card headings. |
| 2. Agent access | All four named User-Agents returned HTTP 200 from the development network on 15 October 2026 at 23:05 UTC. This does not verify crawler identity or access from the scanner's network. Use Security Events and Ray IDs to investigate reported challenges before narrowing a rule. |
| 3. OpenAPI; 4. JSON errors; 10. Rate limits; 11. Schema complexity; 12. Function calling | This domain hosts documentation, not REST or GraphQL endpoints. Node JSON-RPC has versioned OpenRPC specs linked from the API reference, LLM index, and API catalog. Error handling, authentication, and rate limits belong to the node or RPC provider. Do not invent OpenAPI operations, GraphQL schemas, error contracts, or rate-limit headers for a service this site does not run. A function-calling adapter would be a separate product. |
| 5. Markdown negotiation | Apply the existing hostname-scoped Cloudflare configuration rule above. At 23:05 UTC, the homepage still returned HTML for `Accept: text/markdown` and lacked `Vary: Accept`. |
| 6. Brand discoverability | The homepage title identifies Celestia and data availability; its introduction explains the product. Search rankings and external links require follow-up after deployment and indexing. |
| 7. Developer portal; 9. API links; 17. Resource discoverability | The homepage Build and API cards already link to transaction-client guides and the Node API reference. Keep those canonical destinations. API keys or a hosted sandbox would require a separate service and product decision. |
| 8. JSON-LD; 14. Metadata | Existing Organization and WebSite JSON-LD, language, and Open Graph metadata are regression-tested. The export adds a canonical production URL for each documentation page, including the homepage. |
| 13. Sitemap | `/sitemap.xml` already returns XML listing documentation routes. Per-page `lastmod` is optional in the sitemap protocol; omit it until reliable content modification dates are available instead of substituting build times. |
| 15. Organization contact and address; 16. Trust pages | Confirm the publisher's legal identity, public support contact, postal address, and approved privacy policy with the site owner before publishing these. Security disclosure details do not establish a general business contact. Do not create placeholder legal pages or addresses to satisfy a scanner. |

At 23:05 UTC, `/index.md`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`,
`/.well-known/ard.json`, and `/.well-known/api-catalog` returned HTTP 200.
The catalog response still used `application/octet-stream`. Deploy the edge
rules and source changes, verify the public responses again, then rerun the
audit from the scanner's network.
