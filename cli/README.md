# @stakewise/create-vault-interface

A CLI to scaffold a [StakeWise Vault Interface](https://github.com/stakewise/vault-interface) — a Next.js frontend ready to deploy on Vercel.

## Quick start

```bash
npx @stakewise/create-vault-interface
```

Or via your package manager:

```bash
npm  init @stakewise/vault-interface
pnpm create @stakewise/vault-interface
yarn create @stakewise/vault-interface
```

The CLI walks you through a few questions, generates a configured project in the current directory, and is ready to run.

## What it does

1. Asks a series of questions (see below)
2. Clones `stakewise/vault-interface` into your chosen folder (without git history)
3. Removes the bundled `cli/` folder from the clone
4. Optionally rewrites the primary brand color in `src/styles/settings.scss` and `src/styles/tailwind/layers/base.css`
5. Generates a populated `.env` file
6. Initializes a fresh git repository with an initial commit
7. Optionally runs `pnpm install`
8. Optionally launches `npx vercel` to deploy

## Questions

| Step | Question | Notes |
|------|----------|-------|
| Project | Folder name | Defaults to `vault-interface` |
| Theme | Customize primary color? | Optional. If yes — asks for `#rrggbb` for light and dark themes |
| Networks | Which networks to support? | Multi-select: Mainnet / Gnosis / Hoodi |
| Vault | Vault address per network | Validates `0x` + 40 hex chars |
| RPC | RPC URL per network | Required, must be `http(s)://...` |
| Fallback RPC | Fallback URL per network | Optional |
| Owner | Site domain | Required |
| Owner | X (Twitter) account | Optional |
| Wallet | WalletConnect Project ID | Optional |
| Referrer | Referrer address | Optional, validated as `0x` address |
| Locales | Supported languages | Multi-select, all enabled by default |
| Currencies | Supported currencies | Multi-select, all enabled by default |
| Security | Content-Security-Policy | Pre-filled with sensible default |
| Setup | Install dependencies? | Defaults to yes — uses `pnpm` |
| Deploy | Deploy to Vercel? | Defaults to no — runs `npx vercel` |

## Requirements

- Node.js `>=18`
- Git (recommended — the CLI initializes a repo)
- pnpm (recommended — `corepack enable && corepack prepare pnpm@latest --activate`)

## License

MIT
