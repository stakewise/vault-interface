# vault-interface

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
