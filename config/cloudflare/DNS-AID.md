# DNS-AID publication handoff

Status on 22 October 2026: **not published**. The local Cloudflare OAuth grant
has zone read access, but no DNS record write scope. Registrar access is also
needed to complete the DNSSEC chain. Merging this repository cannot publish DNS.

## Verified service and DNS state

- `https://docs.celestia.org/mcp` responds to MCP initialization and lists the
  read-only `list_pages`, `read_page`, and `search_docs` tools without credentials.
- `https://docs.celestia.org/.well-known/ai-catalog.json` links to the server card
  at `https://docs.celestia.org/mcp/server-card`.
- Cloudflare and Google resolvers returned no SVCB answer for
  `_index._agents.docs.celestia.org` or parent DS for `celestia.org`.
  Signed responses from Cloudflare alone do not establish a validated chain;
  Google's discovery response had `AD: false`.

## Record proposal

[dns-aid.zone](dns-aid.zone) contains one ServiceMode SVCB record for the docs
catalog. It advertises HTTP/2 on port 443. It does not advertise an A2A service.

[DNS-AID revision 02](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
is an Internet-Draft, and its custom SvcParamKey numbers are not assigned.
The proposal uses private-use `key65400` for the `cap` URL. This is a local
experimental mapping, **not an IANA assignment or a claim of client compatibility**.
The [IANA registry](https://www.iana.org/assignments/dns-svcb) reserves
65280–65534 for private use. The `mandatory` list makes consumers that do not
understand this mapping skip the record under
[RFC 9460](https://www.rfc-editor.org/rfc/rfc9460).

Before publication, the DNS owner and intended consumer must agree on the
experimental parameter mapping, or replace it with an interoperable registered
mapping when one exists. Keep HTTP AI catalog discovery available throughout.

## DNS owner steps

1. Confirm the parameter mapping with the consuming DNS-AID client. Verify that
   it follows the catalog URL and discovers the live MCP endpoint.
2. In the `celestia.org` Cloudflare zone, add only the record in `dns-aid.zone`
   using [Cloudflare's SVCB record support](https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/).
   Keep the discovery record DNS-only and preserve existing site records.
3. Follow [Cloudflare's DNSSEC guidance](https://developers.cloudflare.com/dns/dnssec/).
   Obtain the current DS values from the zone's DNSSEC configuration and publish
   those exact values at the registrar. Never invent a DS digest or reuse an
   unrelated zone's key. If an unsigned parent must remain, a delegated discovery
   zone still needs a validated chain from the root to provide authenticated data.
4. Check two validating resolvers after propagation:

   ```bash
   dig @1.1.1.1 +dnssec celestia.org DS
   dig @8.8.8.8 +dnssec celestia.org DS
   dig @1.1.1.1 +dnssec _index._agents.docs.celestia.org TYPE64
   dig @8.8.8.8 +dnssec _index._agents.docs.celestia.org TYPE64
   ```

   Require the expected SVCB answer and the `ad` flag on discovery responses,
   then repeat the consumer's catalog-to-MCP connection test. A record visible in
   the dashboard, an RRSIG alone, or a scanner score is insufficient proof.

To roll back the discovery experiment, remove only its SVCB record. DNSSEC
changes affect the whole zone and require a separate coordinated registrar plan.
