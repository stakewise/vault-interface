export type Network = 'mainnet' | 'gnosis' | 'hoodi'

export type Config = {
  csp: string
  title: string
  xAccount: string
  referrer: string
  targetDir: string
  locales: string[]
  networks: Network[]
  ownerDomain: string
  projectName: string
  darkPrimary: string
  currencies: string[]
  lightPrimary: string
  installDeps: boolean
  deployVercel: boolean
  walletConnectId: string
  customizeTheme: boolean
  rpcUrls: Partial<Record<Network, string>>
  fallbackUrls: Partial<Record<Network, string>>
  vaultAddresses: Partial<Record<Network, string>>
}
