# v0-piggy-city

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_2rrfTbL8xtoVApDmnWgJotrfgMtL)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/leocagli/v0-piggy-city" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>

## NFT contract (issue #20)

Soroban collection contract for in-game items lives in `contracts/piggy-nft`:
mint (admin-authorized) of `skin | furni | breed` items with per-item metadata
(`catalog_id`, `name`, `image`), plus the full OZ NonFungibleToken surface
(transfer/approve/owner_of/balance_of/token_uri...).

```bash
cd contracts/piggy-nft && cargo test   # 6 tests, SDK 26.1.1 + stellar-tokens 0.7.2
bash scripts/deploy-piggy-nft.sh        # documented testnet deploy + acceptance flow
```

Testnet deployment (Third Campaign evidence):
- CONTRACT_ID: `CBB7FH42MFOFMZFW76UP7U3RTEW5RRPEQ5FCMAJTVRVS7WQHA2FP2VHO`
- admin: `GB3QLZ5N5WLR7OTYXHWJQJS7DSHIGMBYCIPLXPWHJQZQKOJZWSBBYCVK`
- buyer: `GDFNTEFHHUKSSFX5YBZ27LRJUPZMPHX2WY3U6TTMUZ4MGLJCRMVEW6WM`
- transfer tx: https://stellar.expert/explorer/testnet/tx/509328a7e97f2053a95e91945227ea56ac26675aacc202d35f95f56f8b55fba3
