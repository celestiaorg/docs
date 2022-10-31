---
sidebar_label: Query your Rollup
---

# 💬 Say `gm world!`

Now, you're going to get your blockchain to say `gm world` and in order to do so
you need to make the following changes:

- Modify a protocol buffer file
- Create a keeper query function that returns data
- Register a query function

Protocol buffer files contain proto RPC calls that define Cosmos SDK queries
and message handlers, and proto messages that define Cosmos SDK types. The RPC
calls are also responsible for exposing an HTTP API.

The Keeper is required for each Cosmos SDK module and is an abstraction for
modifying the state of the blockchain. Keeper functions allow you to query or
write to the state. After you add a query to your chain, you need to register
the query. You’ll only need to register a query once.

The typical Cosmos blockchain developer workflow looks something like this:

- Start with proto files to define Cosmos SDK [messages](https://docs.cosmos.network/master/building-modules/msg-services.html)
- Define and register [queries](https://docs.cosmos.network/master/building-modules/query-services.html)
- Define message handler logic
- Finally, implement the logic of these queries and message handlers in keeper functions

## ✋ Create your first query

**For this part of the tutorial, open a new terminal window that is not the
same that you started the chain in.**

In your new terminal, `cd` into the `gm` directory and run this command
to create the `gm` query:

```bash
ignite scaffold query gm --response text
```

Response:

```bash
modify proto/gm/query.proto
modify x/gm/client/cli/query.go
create x/gm/client/cli/query_gm.go
create x/gm/keeper/grpc_query_gm.go

🎉 Created a query `gm`.
```

What just happened? `query` accepts the name of the query (`gm`), an optional
list of request parameters (empty in this tutorial), and an optional
comma-separated list of response field with a `--response` flag (`text` in this
tutorial).

Navigate to the `gm/proto/gm/query.proto` file, you’ll see that `Gm` RPC has
been added to the `Query` service:

<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD013 -->
```protobuf title="gm/proto/gm/query.proto"
service Query {
  rpc Params(QueryParamsRequest) returns (QueryParamsResponse) {
    option (google.api.http).get = "/gm/gm/params";
  }
	rpc Gm(QueryGmRequest) returns (QueryGmResponse) {
		option (google.api.http).get = "/gm/gm/gm";
	}
}
```
<!-- markdownlint-enable MD013 -->
<!-- markdownlint-enable MD010 -->

The `Gm` RPC for the `Query` service:

- is responsible for returning a `text` string
- Accepts request parameters (`QueryGmRequest`)
- Returns response of type `QueryGmResponse`
- The `option` defines the endpoint that is used by gRPC to generate an HTTP API

## 📨 Query request and response types

In the same file, you will find:

- `QueryGmRequest` is empty because it does not require parameters
- `QueryGmResponse` contains `text` that is returned from the chain

```protobuf title="gm/proto/gm/query.proto"
message QueryGmRequest {
}

message QueryGmResponse {
  string text = 1;
}
```

## 👋 Gm keeper function

The `gm/x/gm/keeper/grpc_query_gm.go` file contains the `Gm` keeper function that
handles the query and returns data.

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD010 -->
```go title="gm/x/gm/keeper/grpc_query_gm.go"
func (k Keeper) Gm(goCtx context.Context, req *types.QueryGmRequest) (*types.QueryGmResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)
	_ = ctx
	return &types.QueryGmResponse{}, nil
}
```
<!-- markdownlint-enable MD010 -->
<!-- markdownlint-enable MD013 -->

The `Gm` function performs the following actions:

- Makes a basic check on the request and throws an error if it’s `nil`
- Stores context in a `ctx` variable that contains information about the
environment of the request
- Returns a response of type `QueryGmResponse`

Currently, the response is empty. Let’s update the keeper function.

Your `query.proto` file defines that the response accepts `text`. Use your text
editor to modify the keeper function in `gm/x/gm/keeper/grpc_query_gm.go` .

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD010 -->
```go title="gm/x/gm/keeper/grpc_query_gm.go"
func (k Keeper) Gm(goCtx context.Context, req *types.QueryGmRequest) (*types.QueryGmResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)
	_ = ctx
	return &types.QueryGmResponse{Text: "gm world!"}, nil
}
```
<!-- markdownlint-enable MD010 -->
<!-- markdownlint-enable MD010 -->

## 🟢 Start your Sovereign Rollup

```bash
gmd start --rollmint.aggregator true --rollmint.da_layer celestia --rollmint.da_config='{"base_url":"http://localhost:26658","timeout":60000000000,"gas_limit":6000000}' --rollmint.namespace_id 000000000000FFFF --rollmint.da_start_height 100783
```

The `query` command has also scaffolded
`x/gm/client/cli/query_gm.go` that
implements a CLI equivalent of the gm query and mounted this command in
`x/gm/client/cli/query.go`. Run the following command and get the following
JSON response:

```bash
gmd q gm gm
```

Response:

```bash
text: gm world!
```

![4.png](/img/gm/4.png)

Congratulations 🎉 you've successfully built your first rollup and queried it!
