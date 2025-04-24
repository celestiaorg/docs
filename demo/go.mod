module celestia-demo

go 1.21

require (
	github.com/celestiaorg/celestia-node v0.22.1
)

replace (
	github.com/tendermint/tendermint => github.com/celestiaorg/celestia-core v1.51.0-tm-v0.34.35
)
