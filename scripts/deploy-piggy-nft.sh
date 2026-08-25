#!/usr/bin/env bash
# Deploy + acceptance evidence flow for issue #20 (Piggy City NFT collection).
# Requires: stellar-cli (`cargo install stellar-cli --locked`).
set -euo pipefail

NETWORK=testnet

echo "== 0/6 identities (friendbot-funded) =="
stellar keys generate admin --network "$NETWORK" --fund || true
stellar keys generate buyer  --network "$NETWORK" --fund || true
ADMIN_ADDR=$(stellar keys address admin)
BUYER_ADDR=$(stellar keys address buyer)
echo "admin: $ADMIN_ADDR"
echo "buyer: $BUYER_ADDR"

echo "== 1/6 build =="
cd "$(dirname "$0")/../contracts/piggy-nft"
stellar contract build
WASM=target/wasm32v1-none/release/piggy_nft.wasm

echo "== 2/6 deploy =="
CID=$(stellar contract deploy \
  --wasm "$WASM" \
  --source-account admin \
  --network "$NETWORK" \
  --alias piggy-nft \
  -- --admin "$ADMIN_ADDR" \
     --name "Piggy City Items" \
     --symbol PIGGY \
     --base-uri "ipfs://piggy-base/")
echo "CONTRACT_ID=$CID"

echo "== 3/6 mint one item of each kind =="
for spec in \
  "1 skin skin_001 'Captain Pig' ipfs://skin001.png" \
  "2 furni sofa_001 'Red Sofa' ipfs://sofa001.png" \
  "3 breed cat_breed 'Siamese' ipfs://cat.png"; do
  set -- $spec
  stellar contract invoke --id "$CID" --source-account admin --network "$NETWORK" --send=yes -- \
    mint --to "$ADMIN_ADDR" --token_id "$1" --kind "$2" \
         --catalog_id "$3" --name "$4" --image "$5"
done

echo "== 4/6 transfer to a second account =="
stellar contract invoke --id "$CID" --source-account admin --network "$NETWORK" --send=yes -- \
  transfer --from "$ADMIN_ADDR" --to "$BUYER_ADDR" --token_id 2

echo "== 5/6 read-only verification =="
echo "owner_of(2):    $(stellar contract invoke --id "$CID" --source-account admin --network "$NETWORK" -- owner_of --token_id 2)"
echo "balance(buyer): $(stellar contract invoke --id "$CID" --source-account admin --network "$NETWORK" -- balance --owner "$BUYER_ADDR")"
echo "token_uri(1):   $(stellar contract invoke --id "$CID" --source-account admin --network "$NETWORK" -- token_uri --token_id 1)"
echo "item_meta(1):   $(stellar contract invoke --id "$CID" --source-account admin --network "$NETWORK" -- item_meta --token_id 1)"

echo "== 6/6 done: paste CONTRACT_ID + outputs above into the PR description =="
