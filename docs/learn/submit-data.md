# Submitting data blobs to Celestia

To submit data to Celestia, users submit blob transactions (`BlobTx`). Blob
transactions contain two components, a standard Cosmos-SDK transaction called
`MsgPayForBlobs` and a `Blob` of data.

## Fee market and mempool

Celestia makes use of a standard gas-priced prioritized mempool. By default,
transactions with fees higher than that of other transactions in the mempool
will be prioritized by validators.

### Fees and gas limits

As of version v1.0.0 of the application (celestia-app), there is no protocol
enforced protocol minimum fee (similar to EIP-1559 in Ethereum). Instead, each
consensus node running a mempool uses a locally configured gas price threshold
that must be met in order for that node to accept a transaction, either directly
from a user or gossiped from another node, into its mempool.

As of version v1.0.0 of the application (celestia-app), gas is not refunded.
Instead, transaction fees are deducted by a flat fee, originally determined by
the user via multiplying the gas limit by the desired gas price. This means that
users should use an accurate gas limit value if they do not wish to over pay.

Under the hood, fees are currently handled by specifying and deducting a flat
fee. However gas price is often specifed by users instead of calculating the
flat fee from the gas used and the gas price. Since the state machine does not
refund users for unused gas, gas price is calculated by dividing the total fee
by the gas limit.

#### Estimating PFB gas

Generally, the gas used by a PFB transaction involves a static fixed cost and
a dynamic cost based on the size of each blob involved in the transaction.

> Note: For a general use case of a normal account submitting a PFB, the static
> costs can be treated as such. However, due to the description above of how gas
> works in the Cosmos-SDK this is not always the case. Notably, if we use a
> vesting account or the `feegrant` modules, then these static costs change.

The fixed cost is an approximation of the gas consumed by operations outside
the function `GasToConsume` (for example, signature verification, tx size, read
access to accounts), which has a default value of 65,000 gas.

> Note: the first transaction sent by an account (sequence number == 0) has an
> additional one time gas cost of 10,000 gas. If this is the case, this
> should be accounted for.

Each blob in the PFB contributes to the total gas cost based on its size. The
function `GasToConsume` calculates the total gas consumed by all the blobs
involved in a PFB, where each blob's gas cost is computed by first determining
how many shares are needed to store the blob size. Then, it computes the product
of the number of shares, the number of bytes per share, and the `gasPerByte`
parameter. Finally, it adds a static amount per blob.

The `GasCostPerBlobByte` and `GasCostPerTransactionByte` are parameters that
could potentially be adjusted through the system's governance mechanisms. Hence,
actual costs may vary depending on the current state of these parameters.

#### Gas fee calculation

The total fee for a transaction is calculated as the product of the gas limit
for the transaction and the gas price set by the user:

$\text{Total Fee} = \text{Gas Limit} \times \text{Gas Price}$

The gas limit for a transaction is the maximum amount of gas that a user is
willing to spend on a transaction. It is determined by both a static
fixed cost and a variable dynamic cost based on the size of each blob involved
in the transaction:

$\text{Gas Limit} = \text{Fixed Cost} + \sum_{i=1}^{n} \text{SparseSharesNeeded(Blob}_i) \times \text{Share Size} \times \text{Gas Cost Per Blob Byte}$

Where:

- $\text{Fixed Cost}$ is a static value (65,000 gas)
- $\text{SparseSharesNeeded(Blob}_i)$ is the number of shares needed for the $i$th blob in the transaction
- $\text{Share Size}$ is the size of each share
- $\text{Gas Cost Per Blob Byte}$ is a parameter that could potentially be adjusted through the system's governance mechanisms.

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

By default, nodes will drop a transaction if it does not get included in 10
blocks (roughly 2.5 minutes). At this point, the user must resubmit their
transaction if they want it to eventually be included.

As of v1.0.0 of the application (celestia-app), users are unable to replace an
existing transaction with a different one with higher fees. They must instead
wait 10 blocks from the original submitted time and then resubmit the
transaction. Again, community members have already suggested solutions and a
willingness to accept changes to fix this issue.

## API

Users can currently create and submit `BlobTx`s in four ways.

### The celestia-app consensus node CLI

```terminal
celestia-appd tx blob PayForBlobs <hex encoded namespace> <hex encoded data> [flags]
```

### The celestia-node light node CLI

Using `blob.Submit`:

```terminal
celestia rpc blob submit <hex encoded namespace> <hex encoded data>
```

Learn more in the [node tutorial](../../developers/node-tutorial).

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

    fmt.Println("namepace", len(ns.Bytes()))

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

- [blob.Submit](/api/v0.11.0-rc13/#blob.Submit)
- [state.SubmitPayForBlob](/api/v0.11.0-rc13/#state.SubmitPayForBlob)

Learn more in the [celestia-node API docs](/api/v0.11.0-rc13).
