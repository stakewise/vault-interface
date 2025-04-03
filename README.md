# vault-interface
This is an open-source repository for the Vault interface.
You can customize this UI for your own vault on the
Mainnet, Gnosis, and Chiado networks.

If you provide vault addresses for multiple networks,
a dropdown menu will appear in the UI,
allowing you to select the desired network.

### Demo
[Genesis vault interface](https://stake.fi/)

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
