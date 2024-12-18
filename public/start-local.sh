#!/bin/bash

# Warning for default .celestia-app directory deletion
echo "WARNING: This script will DELETE your existing .celestia-app directory and start a new local testnet."
echo "Make sure you have backed up any important data from .celestia-app"
read -p "Do you wish to continue? [y/n] " answer
if [[ ! "$answer" =~ ^[Yy]$ ]]; then
    echo "Aborting..."
    exit 1
fi

# Function to check if a command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is required but not installed."
        exit 1
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local port=$1
    local service=$2
    echo "Waiting for $service to be ready..."
    while ! nc -z localhost "$port"; do
        sleep 1
    done
    echo "$service is ready!"
    sleep 5  # Give it a little extra time to stabilize
}

# Check for required commands
check_command "celestia-appd"
check_command "celestia"
check_command "jq"
check_command "nc"

# Clean up existing directories
rm -rf "$HOME/.celestia-custom-bridge"
rm -rf "$HOME/.celestia-custom-light"

# Create necessary directories
mkdir -p "$HOME/.celestia-custom-bridge"
mkdir -p "$HOME/.celestia-custom-light"

# Kill any existing celestia processes
pkill celestia-appd
pkill celestia
sleep 2

# Start the validator node
echo "Starting validator node..."
cd "$HOME/celestia-app/scripts" || exit 1

# Automatically answer "y" to the prompt
echo "y" | bash single-node.sh &
wait_for_service 26657 "validator node"

# Get the genesis block hash
echo "Getting genesis block hash..."
BLOCK_HASH=$(curl -s "localhost:26657/block?height=1" | jq -r '.result.block_id.hash')
if [ -z "$BLOCK_HASH" ]; then
    echo "Error: Could not get block hash"
    exit 1
fi

# Export the custom network variable
export CELESTIA_CUSTOM="test:$BLOCK_HASH"
echo "Set CELESTIA_CUSTOM=$CELESTIA_CUSTOM"

# Initialize and start bridge node
echo "Initializing bridge node..."
celestia bridge init \
    --node.store "$HOME/.celestia-custom-bridge" \
    --core.ip localhost \
    --core.grpc.port 9090 \
    --core.rpc.port 26657 \
    --p2p.network test
echo "Starting bridge node..."
celestia bridge start \
    --node.store "$HOME/.celestia-custom-bridge" \
    --core.ip localhost \
    --core.grpc.port 9090 \
    --core.rpc.port 26657 \
    --p2p.network test &
wait_for_service 2121 "bridge node"

# Get bridge node info
echo "Getting bridge node peer info..."
BRIDGE_INFO=$(celestia p2p info --node.store "$HOME/.celestia-custom-bridge")
PEER_ID=$(echo "$BRIDGE_INFO" | jq -r '.result.id')
PEER_ADDR=$(echo "$BRIDGE_INFO" | jq -r '.result.peer_addr[] | select(contains("/ip4/10.0.0.125") and contains("/udp/") and contains("/webrtc-direct/"))' | head -n 1)
if [ -z "$PEER_ID" ] || [ -z "$PEER_ADDR" ]; then
    echo "Error: Could not get peer information"
    exit 1
fi

# Initialize and start light node
echo "Initializing light node..."
celestia light init \
    --p2p.network test \
    --core.ip localhost:26657 \
    --node.store "$HOME/.celestia-custom-light/"

# Construct the light node start command
LIGHT_NODE_CMD="celestia light start \
    --p2p.network test \
    --core.ip localhost:26657 \
    --node.store \"$HOME/.celestia-custom-light/\" \
    --headers.trusted-peers \"$PEER_ADDR/p2p/$PEER_ID\" \
    --rpc.port 42069"

# Log the command
echo "Starting light node with command:"
echo "$LIGHT_NODE_CMD"

# Execute the command
eval "$LIGHT_NODE_CMD" &
wait_for_service 42069 "light node"

# Get addresses and fund light node
echo "Getting node addresses..."
BRIDGE_ADDRESS=$(celestia state account-address --node.store "$HOME/.celestia-custom-bridge" | jq -r '.result')
LIGHT_ADDRESS=$(celestia state account-address --node.store "$HOME/.celestia-custom-light" --url http://localhost:42069 | jq -r '.result')
echo "Funding light node..."
celestia-appd tx bank send validator "$LIGHT_ADDRESS" 10000000utia \
    --chain-id test \
    --keyring-backend test \
    --fees 500utia -y
echo "Waiting for funding transaction to be included in a block..."
sleep 5
echo "Testing blob submission..."
celestia blob submit 0x4772756763686174 '"Simplicity is the ultimate sophistication." -Leonardo da Vinci' \
    --node.store "$HOME/.celestia-custom-light" \
    --url http://localhost:42069
echo "Setup complete!"
echo "Bridge node address: $BRIDGE_ADDRESS"
echo "Light node address: $LIGHT_ADDRESS"
echo "Custom network: $CELESTIA_CUSTOM"
