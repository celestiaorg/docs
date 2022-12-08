---
sidebar_label: Query your Rollup
---

# 💬 Say gm world

Now, we're going to get our blockchain to say `gm world!` - in order to do so
you need to make the following changes:

- Modify a protocol buffer file
- Create a keeper query function that returns data

Protocol buffer files contain proto RPC calls that define Cosmos SDK queries
and message handlers, and proto messages that define Cosmos SDK types. The RPC
calls are also responsible for exposing an HTTP API.

The `Keeper` is required for each Cosmos SDK module and is an abstraction for
modifying the state of the blockchain. Keeper functions allow us to query or
write to the state.

## ✋ Create your first query

**Open a new terminal instance that is not the
same that you started the chain in.**

In your new terminal, `cd` into the `gm` directory and run this command
to create the `gm` query:

```bash
ignite scaffold query gm --response text
```

Response:

```bash
modify proto/gm/gm/query.proto
modify x/gm/client/cli/query.go
create x/gm/client/cli/query_gm.go
create x/gm/keeper/grpc_query_gm.go

🎉 Created a query `gm`.
```

What just happened? `query` accepts the name of the query (`gm`), an optional
list of request parameters (empty in this tutorial), and an optional
comma-separated list of response field with a `--response` flag (`text` in this
tutorial).

Navigate to the `gm/proto/gm/gm/query.proto` file, you’ll see that `Gm` RPC has
been added to the `Query` service:

<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD013 -->
```protobuf title="gm/proto/gm/gm/query.proto"
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

In the same file, we will find:

- `QueryGmRequest` is empty because it does not require parameters
- `QueryGmResponse` contains `text` that is returned from the chain

```protobuf title="gm/proto/gm/gm/query.proto"
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

Currently, the response is empty and you'll need to update the keeper function.

Our `query.proto` file defines that the response accepts `text`. Use your text
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
<!-- markdownlint-enable MD013 -->

## Install your Sovereign Rollup
We need to build the app before running it in the next section:
```
cd cmd/gmd
go install .
cd -
```
You might also need to add GOPATH to your PATH to be able to run gmd:
```
export PATH=$PATH:$(go env GOPATH)
```

## 🟢 Start your Sovereign Rollup

We have a handy `init.sh` found in this repo
[here](https://github.com/celestiaorg/devrel-tools).

We can copy it over to our directory with the following commands:

```sh
# From inside the `gm` directory
cd ..
git clone https://github.com/celestiaorg/devrel-tools
cp devrel-tools/gm/init.sh gm/
cd gm/
```

This copies over our `init.sh` script to initialize our
gm rollup.

You can view the contents of the script to see how we
initialize the gm rollup.

You can initialize the script with the following command:

```sh
bash init.sh
```

With that, we have kickstarted our `gmd` network!

The `query` command has also scaffolded
`x/gm/client/cli/query_gm.go` that
implements a CLI equivalent of the gm query and mounted this command in
`x/gm/client/cli/query.go`.

In a separate window, run the following command:

```bash
gmd q gm gm
```

We will get the following JSON response:

```bash
text: gm world!
```

![4.png](/img/gm/4.png)

Congratulations 🎉 you've successfully built your first rollup and queried it!
