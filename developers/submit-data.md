# Submitting data blobs to Celestia

<!-- markdownlint-disable MD013 -->

To submit data to Celestia, users submit blob transactions (`BlobTx`). Blob
transactions contain two components, a standard Cosmos-SDK transaction called
`MsgPayForBlobs` and one or more `Blob`s of data.

## Fee market and mempool

Celestia makes use of a standard gas-priced prioritized mempool. By default,
transactions with gas prices higher than that of other transactions in the mempool
will be prioritized by validators.

### Fees and gas limits

As of version v1.0.0 of the application (celestia-app), there is no protocol
enforced minimum fee (similar to EIP-1559 in Ethereum). Instead, each
consensus node running a mempool uses a locally configured gas price threshold
that must be met in order for that node to accept a transaction, either directly
from a user or gossiped from another node, into its mempool.

As of version v1.0.0 of the application (celestia-app), gas is not refunded.
Instead, transaction fees are deducted by a flat fee, originally specified by
the user in their tx (where fees = gasLimit \* gasPrice). This means that
users should use an accurate gas limit value if they do not wish to overpay.

Under the hood, fees are currently handled by specifying and deducting a flat
fee. However gas price is often specified by users instead of calculating the
flat fee from the gas used and the gas price. Since the state machine does not
refund users for unused gas, gas price is calculated by dividing the total fee
by the gas limit.

#### Estimating PFB gas

Generally, the gas used by a PFB transaction involves a static fixed cost and
a dynamic cost based on the size of each blob in the transaction.

:::tip NOTE
For a general use case of a normal account submitting a PFB, the static
costs can be treated as such. However, due to the description above of how gas
works in the Cosmos-SDK this is not always the case. Notably, if a
vesting account or the `feegrant` modules are used, then these static costs change.
:::

The fixed cost is an approximation of the gas consumed by operations outside
the function `GasToConsume` (for example, signature verification, tx size, read
access to accounts), which has a default value of 65,000 gas.

:::tip NOTE
The first transaction sent by an account (sequence number == 0) has an
additional one time gas cost of 10,000 gas. If this is the case, this
should be accounted for.
:::

Each blob in the PFB contributes to the total gas cost based on its size. The
function `GasToConsume` calculates the total gas consumed by all the blobs
involved in a PFB, where each blob's gas cost is computed by first determining
how many shares are needed to store the blob size. Then, it computes the product
of the number of shares, the number of bytes per share, and the `gasPerByte`
parameter. Finally, it adds a static amount per blob.

The [`blob.GasPerBlobByte`](https://github.com/celestiaorg/celestia-app/blob/ad91a5b2ca2d562f0b8c9c2e1ed6b4d3098a2e8e/specs/src/specs/params.md?plain=1#L27)
and [`auth.TxSizeCostPerByte`](https://github.com/celestiaorg/celestia-app/blob/ad91a5b2ca2d562f0b8c9c2e1ed6b4d3098a2e8e/specs/src/specs/params.md?plain=1#L25)
are parameters that
could potentially be adjusted through the system's governance mechanisms. Hence,
actual costs may vary depending on the current state of these parameters.

#### Gas fee calculation

The total fee for a transaction is calculated as the product of the gas limit
for the transaction and the gas price set by the user:

$\text{Total Fee} = \text{Gas Limit} \times \text{Gas Price}$

The gas limit for a transaction is the maximum amount of gas that a user is
willing to spend on a transaction. It is determined by both a static
fixed cost (FC) and a variable dynamic cost based on the size of each blob involved
in the transaction:

$\text{Gas Limit} = FC + \sum_{i=1}^{n} SSN(B_i) \times SS \times GCPBB$

Where:

- $FC$ = Fixed Cost, is a static value (65,000 gas)
- $\sum_{i=1}^{n} SSN(B_i)$ = SparseSharesNeeded for the $i$th Blob, is the number of shares needed for the $i$th blob in the transaction
- $SS$ = Share Size, is the size of each share
- $GCPBB$ = Gas Cost Per Blob Byte, is a parameter that could potentially be adjusted through the system's governance mechanisms.

The gas fee is set by the user when they submit a transaction. The fee is often
specified by users directly. The total cost for the transaction is then
calculated as the product of the estimated gas limit and the gas price.
Since the state machine does not refund users for unused gas,
it's important for users to estimate the gas limit accurately to
avoid overpaying.

For more details on how gas is calculated per blob, refer to the
[`PayForBlobs` function](https://github.com/celestiaorg/celestia-app/blob/32d247971386c1944d44bec1faeb000b1ff1dd51/x/blob/keeper/keeper.go#L53)
that consumes gas based on the blob sizes. This function uses the
[`GasToConsume` function](https://github.com/celestiaorg/celestia-app/blob/32d247971386c1944d44bec1faeb000b1ff1dd51/x/blob/types/payforblob.go#L157-L167)
to calculate the extra gas charged to pay for a set of blobs in a `MsgPayForBlobs`
transaction. This function calculates the total shares used by all blobs and
multiplies it by the `ShareSize` and `gasPerByte` to get the total gas to consume.

For estimating the total gas required for a set of blobs, refer to the
[`EstimateGas` function](https://github.com/celestiaorg/celestia-app/blob/32d247971386c1944d44bec1faeb000b1ff1dd51/x/blob/types/payforblob.go#L169-L181).
This function estimates the gas based on a linear model that is dependent on
the governance parameters: `gasPerByte` and `txSizeCost`. It assumes other
variables are constant, including the assumption that the `MsgPayForBlobs`
is the only message in the transaction. The `DefaultEstimateGas` function
runs `EstimateGas` with the system defaults.

#### Estimating gas programmatically

Users can estimate an efficient gas limit by using this function:

```go
import (
    blobtypes "github.com/celestiaorg/celestia-app/x/blob/types"
)
gasLimit := blobtypes.DefaultEstimateGas([]uint32{uint32(sizeOfDataInBytes)})
```

If using a celestia-node light client, then this function is automatically
called for you when submitting a blob. This function works by breaking down the
components of calculating gas for a blob transaction. These components consist
of a flat costs for all PFBs, the size of each blob and how many shares each
uses and the parameter for gas used per byte. More information about how gas is
used can be found in the [gas
specs](https://github.com/celestiaorg/celestia-app/blob/d17e231ae3a0150b50a1854f3e9a268c34502b6b/specs/src/specs/resource_pricing.md)
and the exact formula can be found in the [blob
module](https://github.com/celestiaorg/celestia-app/blob/d17e231ae3a0150b50a1854f3e9a268c34502b6b/x/blob/types/payforblob.go#L157-L181).

### Submitting multiple transactions in one block from the same account

The mempool Celestia uses works by maintaining a fork of the canonical state
each block. This means that each time we submit a transaction to it, it will
update the sequence number (aka nonce) for the account that submitted the
transaction. If users wish to submit a second transaction, they can, but must
specify the nonce manually. If this is not done, the new transactions will not
be able to be submitted until the first transaction is reaped from the mempool (i.e. included in a block), or dropped due to timing out.

By default, nodes will drop a transaction if it does not get included in 5
blocks (roughly 1 minute). At this point, the user must resubmit their
transaction if they want it to eventually be included.

As of v1.0.0 of the application (celestia-app), users are unable to replace an
existing transaction with a different one with higher fees. They must instead
wait 5 blocks from the original submitted time and then resubmit the
transaction. Again, community members have already suggested solutions and a
willingness to accept changes to fix this issue.

## API

Users can currently create and submit `BlobTx`s in four ways.

### The celestia-app consensus node CLI

```bash
celestia-appd tx blob PayForBlobs <hex-encoded namespace> <hex-encoded data> [flags]
```

### The celestia-node light node CLI

Using `blob.Submit`:

```bash
celestia blob submit <hex-encoded namespace> <hex-encoded data>
```

Learn more in the [node tutorial](./node-tutorial.md).

### The celestia-node API golang client

For more celestia-node API golang examples, refer to the [golang client tutorial](./golang-client-tutorial.md).

```go
import (
	"bytes"
	"context"
	"fmt"

	client "github.com/celestiaorg/celestia-openrpc"
	"github.com/celestiaorg/celestia-openrpc/types/blob"
	"github.com/celestiaorg/celestia-openrpc/types/share"
)

// SubmitBlob submits a blob containing "Hello, World!" to the 0xDEADBEEF namespace. It uses the default signer on the running node.
func SubmitBlob(ctx context.Context, url string, token string) error {
	client, err := client.NewClient(ctx, url, token)
	if err != nil {
		return err
	}

	// let's post to 0xDEADBEEF namespace
	namespace, err := share.NewBlobNamespaceV0([]byte{0xDE, 0xAD, 0xBE, 0xEF})
	if err != nil {
		return err
	}

	// create a blob
	helloWorldBlob, err := blob.NewBlobV0(namespace, []byte("Hello, World!"))
	if err != nil {
		return err
	}

	// submit the blob to the network
	height, err := client.Blob.Submit(ctx, []*blob.Blob{helloWorldBlob}, blob.DefaultGasPrice())
	if err != nil {
		return err
	}

	fmt.Printf("Blob was included at height %d\n", height)

	// bonus: fetch the blob back from the network
	retrievedBlobs, err := client.Blob.GetAll(ctx, height, []share.Namespace{namespace})
	if err != nil {
		return err
	}

	fmt.Printf("Blobs are equal? %v\n", bytes.Equal(helloWorldBlob.Commitment, retrievedBlobs[0].Commitment))
	return nil
}}
```

### GRPC to a consensus node via the `user` package

```go
import (
    "context"
    "fmt"

    "github.com/celestiaorg/celestia-app/app"
    "github.com/celestiaorg/celestia-app/app/encoding"
    "github.com/celestiaorg/celestia-app/pkg/appconsts"
    "github.com/celestiaorg/celestia-app/pkg/namespace"
    "github.com/celestiaorg/celestia-app/pkg/user"
    blobtypes "github.com/celestiaorg/celestia-app/x/blob/types"
    "github.com/cosmos/cosmos-sdk/crypto/keyring"
    tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
)

// SubmitData is a demo function that shows how to use the signer to submit data
// to the blockchain directly via a celestia node. We can manage this keyring
// using the `celestia-appd keys` or `celestia keys` sub commands and load this
// keyring from a file and use it to programmatically sign transactions.
func DemoSubmitData(grpcAddr string, kr keyring.Keyring) error {
    // create an encoding config that can decode and encode all celestia-app
    // data structures.
    ecfg := encoding.MakeConfig(app.ModuleEncodingRegisters...)

    // create a connection to the grpc server on the consensus node.
    conn, err := grpc.Dial(grpcAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
    if err != nil {
        return err
    }
    defer conn.Close()

    // get the address of the account we want to use to sign transactions.
    rec, err := kr.Key("accountName")
    if err != nil {
        return err
    }

    addr, err := rec.GetAddress()
    if err != nil {
        return err
    }

    // Setup the signer. This function will automatically query the relevant
    // account information such as sequence (nonce) and account number.
    signer, err := user.SetupSigner(context.TODO(), kr, conn, addr, ecfg)
    if err != nil {
        return err
    }

    ns := namespace.MustNewV0([]byte("1234567890"))

    fmt.Println("namespace", len(ns.Bytes()))

    blob, err := blobtypes.NewBlob(ns, []byte("some data"), appconsts.ShareVersionZero)
    if err != nil {
        return err
    }

    gasLimit := blobtypes.DefaultEstimateGas([]uint32{uint32(len(blob.Data))})

    options := []user.TxOption{
        // here we're setting estimating the gas limit from the above estimated
        // function, and then setting the gas price to 0.1utia per unit of gas.
        user.SetGasLimitAndFee(gasLimit, 0.1),
    }

    // this function will submit the transaction and block until a timeout is
    // reached or the transaction is committed.
    resp, err := signer.SubmitPayForBlob(context.TODO(), []*tmproto.Blob{blob}, options...)
    if err != nil {
        return err
    }

    // check the response code to see if the transaction was successful.
    if resp.Code != 0 {
        // handle code
        fmt.Println(resp.Code, resp.Codespace, resp.RawLog)
    }

    // if we don't want to wait for the transaction to be confirmed, we can
    // manually sign and submit the transaction using the same package.
    blobTx, err := signer.CreatePayForBlob([]*tmproto.Blob{blob}, options...)
    if err != nil {
        return err
    }

    resp, err = signer.BroadcastTx(context.TODO(), blobTx)
    if err != nil {
        return err
    }

    // check the response code to see if the transaction was successful. Note
    // that this time we're not waiting for the transaction to be committed.
    // Therefore the code here is only from the consensus node's mempool.
    if resp.Code != 0 {
        // handle code
        fmt.Println(resp.Code, resp.Codespace, resp.RawLog)
    }

    return err
}
```

### RPC to a celestia-node

Using the JSON RPC API, submit data using the following methods:

- [blob.Submit](https://node-rpc-docs.celestia.org/#blob.Submit)
- [state.SubmitPayForBlob](https://node-rpc-docs.celestia.org/#state.SubmitPayForBlob)

Learn more in the [celestia-node API docs](https://node-rpc-docs.celestia.org/).

<!-- markdownlint-disable MD013 -->
