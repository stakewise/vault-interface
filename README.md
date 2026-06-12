# Vault interface

This is an open-source repository for the Vault interface.
You can customize this UI for your own vault on the
Mainnet, Gnosis and Hoodi networks.

If you provide vault addresses for multiple networks,
a dropdown menu will appear in the UI,
allowing you to select the desired network.

### Demo
[Genesis vault interface](https://vault-interface-lemon.vercel.app/)

### Quick start (recommended)

Use the CLI to scaffold a configured project in seconds:

```bash
npx @stakewise/create-vault-interface
```

It will ask you a few questions (networks, vault addresses, RPC URLs, theme,
WalletConnect ID, etc.), generate a `.env` file, install dependencies, and
optionally deploy to Vercel. See [`cli/README.md`](./cli/README.md) for details.

### Manual setup
1. Clone the repository.
2. Create a `.env` file in the root of the project.
3. Copy the contents of `.env.example` into your `.env` file.
4. Replace the values in `.env` with your specific configurations:

- <b>Mainnet Vault</b>:
  - Add the vault address to `NEXT_PUBLIC_MAINNET_VAULT_ADDRESS`.
  - Set the RPC URL in `NEXT_PUBLIC_MAINNET_NETWORK_URL`.
  - Optionally, add `NEXT_PUBLIC_MAINNET_FALLBACK_URL` for a backup RPC connection.

- <b>Gnosis Vault</b>:
  - Add the vault address to `NEXT_PUBLIC_GNOSIS_VAULT_ADDRESS`.
  - Provide the RPC URL for `NEXT_PUBLIC_GNOSIS_NETWORK_URL`.

- If you have vaults on both Mainnet and Gnosis, be sure to complete the previous steps for each network.

- <b>Testnet Vaults</b>:
  - Add the vault address to `NEXT_PUBLIC_HOODI_VAULT_ADDRESS`.
  - Set the RPC URL in `NEXT_PUBLIC_HOODI_NETWORK_URL`.
  - Test environment networks will appear in the network list only if the `VERCEL_ENV` variable is not set to `production`. In a production environment, you can switch to the testnet only through the wallet interface.

- <b>Vault Ownership</b>:
  - Specify the owner’s domain in `NEXT_PUBLIC_OWNER_DOMAIN`.
  - Add the X account for metadata as `NEXT_PUBLIC_OWNER_X_ACCOUNT`.

- <b>Wallet Connect</b>:
  - To enable Wallet Connect, set `NEXT_PUBLIC_WALLET_CONNECT_ID`. Otherwise, it will not be available as a connection option.

- <b>Referrer Address</b>:
  - If you want to include a referrer address for staking and minting actions, assign a value to `NEXT_PUBLIC_REFERRER`.

- <b>Language Configuration</b>:
  - The UI supports 7 languages by default (en, ru, fr, es, pt, de, zh). To exclude any languages, set the `NEXT_PUBLIC_LOCALES` variable. For instance, for English and Chinese only, use `NEXT_PUBLIC_LOCALES=en, zh`.

- <b>Currency Configuration</b>:
  - The UI supports 7 currencies by default (usd, eur, gbp, cny, jpy, krw, aud). To exclude currencies, set the `NEXT_PUBLIC_CURRENCIES` variable. For example, for USD and EUR only, use `NEXT_PUBLIC_CURRENCIES=usd, eur`.

- <b>Content-Security-Policy Configuration</b>:
  - If you want your site to open in a frame, you can list sites where this is possible. `NEXT_PUBLIC_CONTENT_SECURITY_POLICY=https://app.safe.global https://*.blockscout.com`.

5. Verify Node Version: Ensure your Node.js version is `24.12.0` or higher (see `.nvmrc`).
6. Install pnpm if you don't have it: `corepack enable && corepack prepare pnpm@latest --activate`.
7. Run `pnpm install` to install the necessary dependencies.
8. <b>Start the Development Server</b>: Run `pnpm dev` to start the server. Then navigate to [http://localhost:5005](http://localhost:5005) in your browser to view the application.
9. <b>Build for Production using Vercel</b>: Follow [Vercel instructions](https://vercel.com/docs/getting-started-with-vercel/import) to connect your repository to Vercel and automatically build and serve the app.
10. <b>Build for Production using hosting</b>: Run `pnpm build` to prepare the app for production. After that, deploy the build files to your hosting service.

### Vault actions
The vault interface allows you to perform the following actions:

- <b>Deposit</b>: Access this feature under the Stake tab.
- <b>Mint</b>: Available only if the vault has osToken enabled.
- <b>Boost</b>: Visible only if minting is enabled, vault is on the Ethereum network, and the vault version is higher than 2.
- <b>Withdraw</b>: Access this feature under the Unstake tab.
- <b>Burn</b>: Available only if the vault has osToken enabled.
- <b>Unboost</b>: Visible only if the vault has osToken enabled.
- <b>Balance Tab</b>: Displays current user stats, unstake/unboost queue data, and claim actions.

### Environment Variables
Add a `.env` file in the root of the project (or `.env.local` — both are gitignored).
Copy environment variables from the `.env.example` file and replace the values with the actual values.
Add vault address, rpc urls for the vault network, owner data, wallet connect id (if needed) and interface settings (locales, currencies).

### Themes and colors
There are light and dark themes available.
By default the user will see a theme matching the system preference: light if the system theme is light, dark otherwise.
The theme can be changed in the settings menu.

Colors are defined in the `src/styles/settings.scss` file and can be customized to your preferences.
After updating the colors, run `pnpm colors` — this script will generate RGB versions from your hex codes and update the following files:

- `src/styles/tailwind/layers/base.css`
- `src/styles/tailwind/theme.css`
- `src/styles/variables.scss`


### Favicon
The favicon is a 16x16 image that is displayed in the browser tab. It is located in the `public` folder.
By default, osETH logo is used as the favicon.
