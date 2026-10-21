# API specifications

`/openapi.json` is a copy of the celestia-app v10 REST API
specification (OpenAPI/Swagger 2.0), published by the upstream gRPC-gateway build.
The upstream file repeats operation IDs across modules. This copy makes only
those duplicate IDs unique using the HTTP method and path; endpoints, parameters,
and response schemas are unchanged. It is separate from the versioned
celestia-node OpenRPC files in this directory.
The docs host serves the contract, not the REST endpoints. Set your API client's
base URL to your celestia-app REST provider and confirm its software version.
The upstream file deliberately has no `host` or `schemes` field.

- Source: https://github.com/celestiaorg/celestia-app/blob/3dd6e22d076ac2131156c98f20c1fda7df195d9c/swagger/swagger.json
- Published upstream: https://celestiaorg.github.io/celestia-app/swagger/swagger.json
- Retrieved: 2026-10-21
- Upstream SHA-256: `90fbd20e7242536f605568a973e93dfb80398cb700cdf667371c359d0f7f5625`

To refresh, review the upstream release and generated specification, copy its
`swagger/swagger.json` from a pinned `celestia-app` `gh-pages` commit to
`public/openapi.json`, and update this provenance. For each repeated operation
ID, use `<method>_<path>` with non-alphanumeric path characters collapsed to `_`
and leading/trailing underscores removed. Validate with
`bunx @apidevtools/swagger-cli validate public/openapi.json`, then run
`bun run build` to validate local references and discovery links. Builds use the checked-in snapshot and do
not depend on upstream network availability. This snapshot does not establish
network activation or provider compatibility.
