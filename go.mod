module celestia-docs-test

go 1.23.6

toolchain go1.23.8

require (
	github.com/celestiaorg/celestia-node v0.22.1
	github.com/celestiaorg/go-square/v2 v2.2.0
)

replace (
	github.com/cosmos/cosmos-sdk => github.com/celestiaorg/cosmos-sdk v1.28.2-sdk-v0.46.16
	github.com/filecoin-project/dagstore => github.com/celestiaorg/dagstore v0.0.0-20230824094345-537c012aa403
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	github.com/ipfs/boxo => github.com/celestiaorg/boxo v0.29.0-fork
	github.com/syndtr/goleveldb => github.com/syndtr/goleveldb v1.0.1-0.20210819022825-2ae1ddf74ef7
	github.com/tendermint/tendermint => github.com/celestiaorg/celestia-core v1.51.0-tm-v0.34.35
)