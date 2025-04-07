# vault-interface
This is an open-source repository for the Vault interface.
You can customize this UI for your own vault on the
Mainnet, Gnosis, Hoodi, and Chiado networks.

If you provide vault addresses for multiple networks,
a dropdown menu will appear in the UI,
allowing you to select the desired network.

### Demo
[Genesis vault interface](https://stake.fi/)

### Setup and Launch
1. Clone the repository.
2. Create a `.env.local` file in the root of the project.
3. Copy the contents of `.env.example` into your `.env.local` file.
4. Replace the values in `.env.local` with your specific configurations:

- <b>Mainnet Vault</b>:
  - Add the vault address to `NEXT_PUBLIC_MAINNET_VAULT_ADDRESS`.
  - Set the RPC URL in `NEXT_PUBLIC_MAINNET_NETWORK_URL`.
  - Optionally, add `NEXT_PUBLIC_MAINNET_FALLBACK_URL` for a backup RPC connection.

- <b>Gnosis Vault</b>:
  - Add the vault address to `NEXT_PUBLIC_GNOSIS_VAULT_ADDRESS`.
  - Provide the RPC URL for `NEXT_PUBLIC_GNOSIS_NETWORK_URL`.

- If you have vaults on both Mainnet and Gnosis, be sure to complete the previous steps for each network.

- <b>Testnet Vaults</b>:
  - Add the vault address to `NEXT_PUBLIC_HOODI_VAULT_ADDRESS` and/or `NEXT_PUBLIC_CHIADO_VAULT_ADDRESS`.
  - Testnet networks will only be displayed in the network selection if `NEXT_PUBLIC_IS_PROD` is set to `false`. In a production environment, you can switch to the testnet only through the wallet interface.

- <b>Vault Ownership</b>:
  - Add your vault owner’s title in `NEXT_PUBLIC_OWNER`.
  - Specify the owner’s domain in `NEXT_PUBLIC_OWNER_DOMAIN`.
  - Add the X account for metadata as `NEXT_PUBLIC_OWNER_X_ACCOUNT`.

- <b>Wallet Connect</b>:
  - To enable Wallet Connect, set `NEXT_PUBLIC_WALLET_CONNECT_ID`. Otherwise, it will not be available as a connection option.

- <b>Referrer Address</b>:
  - If you want to include a referrer address for staking and minting actions, assign a value to `NEXT_PUBLIC_REFERRER`.

- <b>Language Configuration</b>:
  - The UI supports 7 languages by default (en, ru, fr, es, pt, de, zh). To exclude any languages, set the `NEXT_PUBLIC_LOCALES` variable. For instance, for English and Chinese only, use `NEXT_PUBLIC_LOCALES=en, zh`.

- <b>Currency Configuration</b>:
  - The UI supports 7 currencies by default (USD, EUR, GBP, JPY, CNY, CHF, AUD). To exclude currencies, set the `NEXT_PUBLIC_CURRENCIES` variable. For example, for USD and EUR only, use `NEXT_PUBLIC_CURRENCIES=USD, EUR`.
- Set `NEXT_PUBLIC_IS_PROD=false` for development and `NEXT_PUBLIC_IS_PROD=true` for production. It will make code optimizations for production build.
5. Verify Node Version: Ensure your Node.js version is `20.12.2` or higher.
6. Run `npm install` to install the necessary dependencies.
7. <b>Start the Development Server</b>: Run `npm run dev` to start the server. Then navigate to [http://localhost:5005](http://localhost:5005) in your browser to view the application.
8. <b>Build for Production using Vercel</b>: Follow [Vercel instructions](https://vercel.com/docs/getting-started-with-vercel/import) to connect your repository to Vercel and automatically build and serve the app.
9. <b>Build for Production using hosting</b>: Run `npm run build` to prepare the app for production. After that, deploy the build files to your hosting service.

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
Add `.env.local` file in the root of the project.
Copy environment variables from the `.env.example` file and replace the values with the actual values.
Add vault address, rpc urls for the vault network, owner data, wallet connect id (if needed) and interface settings (locales, currencies).

### Themes and colors
There are light and dark themes available.
The default user will see theme that is the same as system. It will be light if the system theme is light and dark if the system theme is dark.
Theme can be changed in the settings menu.

Colors are defined in `src/scss/settings.scss` file and can be updated to your own.

### Favicon
The favicon is a 16x16 image that is displayed in the browser tab. It is located in the `public` folder.
By default, osETH logo is used as the favicon.
