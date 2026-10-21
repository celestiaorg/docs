# API specifications

`/openapi.json` is generated from the celestia-app release selected by
`app-latest-tag` and `app-latest-sha` in `constants/mainnet_versions.json`.
The existing Latest Tags workflow refreshes it in the same pull request as the
version constants, including repairs when the bundled spec is missing or stale.
Mocha version changes do not select the OpenAPI version.

The generator checks out that release tag and verifies its commit before running
the upstream Swagger generator. It uses the tool versions from that release's
Makefile and pins the Cosmos SDK input to its `proto/buf.lock` revision, rather
than the upstream script's floating registry reference.

The generated contract has three metadata adjustments: duplicate operation IDs
become unique HTTP method/path IDs, `info.version` records the exact app tag, and
`x-celestia-app-commit` records its source commit. Endpoints and schemas come from
the selected release's protobuf sources and locked dependencies.

## Update and validation

```bash
bun run sync:app-api
bun run check:app-api
```

Generation needs Git, Go 1.26 or later, Bash, jq, and network access to GitHub,
Go modules, and the Buf registry. The release workflow installs the prerequisites.
The script installs the release's pinned Buf and OpenAPI plugin in a temporary
directory and removes that directory afterwards.

A matching, valid spec is left unchanged. Generation or validation failure leaves
the previous file intact and stops the release workflow before it opens a PR.
`check:app-api` runs in CI and every build; it validates the contract and requires
its version and source commit to match the Mainnet Beta constants. Checks and
normal documentation builds are offline with respect to upstream APIs.

The docs host serves the contract, not REST endpoints. Set your API client's base
URL to your celestia-app REST provider and confirm its software version. The
upstream specification has no `host` or `schemes` field. The versioned
celestia-node OpenRPC files remain separate. A published release does not
establish network activation or provider compatibility.
