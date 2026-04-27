#!/bin/sh

anvil --compute-units-per-second=100 --fork-url=$RPC_URL --block-time=5 --port=8545 --chain-id=1 --host=0.0.0.0
