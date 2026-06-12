#!/bin/sh
set -e

source .env

docker run --rm -d --name anvil-mainnet \
  -p 8545:8545 \
  ghcr.io/foundry-rs/foundry:latest \
  "anvil --compute-units-per-second=100 --fork-url=$RPC_URL --block-time=5 --port=8545 --chain-id=1 --host=0.0.0.0"

cleanup() {
  docker stop anvil-mainnet 2>/dev/null || true
}
trap cleanup INT TERM EXIT

docker logs -f anvil-mainnet
