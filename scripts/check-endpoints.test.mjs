import assert from "node:assert/strict";
import test from "node:test";

import * as endpointChecker from "./check-endpoints.mjs";

const { checkEndpoint, resolveCheck } = endpointChecker;

test("bare RPC hosts fall back from the default TCP port to HTTPS", () => {
  assert.deepEqual(resolveCheck("rpc.example.com", "rpc"), {
    type: "tcp-http",
    host: "rpc.example.com",
    port: 26657,
    url: "https://rpc.example.com",
    label: "rpc.example.com",
  });
});

test("RPC paths use the hostname for TCP and preserve the path for HTTPS", () => {
  assert.deepEqual(resolveCheck("rpc.example.com/v1/project", "rpc"), {
    type: "tcp-http",
    host: "rpc.example.com",
    port: 26657,
    url: "https://rpc.example.com/v1/project",
    label: "rpc.example.com/v1/project",
  });
});

test("RPC fallback tries HTTPS when the default TCP port is closed", async () => {
  const attempts = [];
  const ok = await checkEndpoint(
    {
      type: "tcp-http",
      host: "rpc.example.com",
      port: 26657,
      url: "https://rpc.example.com",
    },
    {
      checkTcpFn: async () => {
        attempts.push("tcp");
        return false;
      },
      checkHttpFn: async () => {
        attempts.push("http");
        return true;
      },
    },
  );

  assert.equal(ok, true);
  assert.deepEqual(attempts, ["tcp", "http"]);
});

test("explicit RPC ports and bare gRPC hosts keep TCP-only checks", () => {
  assert.deepEqual(resolveCheck("rpc.example.com:26657", "rpc"), {
    type: "tcp",
    host: "rpc.example.com",
    port: 26657,
    label: "rpc.example.com:26657",
  });
  assert.deepEqual(resolveCheck("grpc.example.com", "grpc"), {
    type: "tcp",
    host: "grpc.example.com",
    port: 9090,
    label: "grpc.example.com",
  });
});

test("endpoint removal preserves markdown table width", () => {
  const row = "| Provider | `rpc.example.com` | `api.example.com` |";
  const updated = endpointChecker.replaceEndpointWithPlaceholder(row, "rpc.example.com");

  assert.equal(updated.length, row.length);
  assert.equal(updated, "| Provider | -                 | `api.example.com` |");
});
