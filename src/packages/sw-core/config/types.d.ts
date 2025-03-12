import type { BrowserProvider } from 'ethers'


declare global {

  declare namespace ConfigProvider {

    type ConnectorData = {
      account?: string
      chainId?: ChainIds
    }

    type State = {
      networkId: NetworkIds
      address: string | null
      library?: BrowserProvider
      accountName: string | null
      autoConnectChecked: boolean
      connector: Connectors | null
      activeWallet: WalletIds | null
    }

    type ConfigState = {
      data: State
      initialData: State
      dataRef: { current: State }
      setData: (data: Partial<State>) => void
    }

    type Wallet = {
      disconnect: () => Promise<void>
      setAddress: (address: string) => void
      connect: (walletName: WalletIds) => Promise<void>
      changeChain: (networkId: NetworkIds) => Promise<void>
    }

    type CancelOnChangeInput = {
      logic: () => any
      chainId: ChainIds
      address: string | null
    }

    type Context<T = {}> = T & State & {
      wallet: Wallet
      chainId: ChainIds
      isReadOnlyMode: boolean
      isInjectedWallet: boolean
      cancelOnChange: (values: CancelOnChangeInput) => any
    }

    type Callbacks = {
      onStartConnect: (activationMessage: Intl.Message | string) => void
      onFinishConnect: () => void
      onConnectError: () => void
      onChangeChain?: () => void
      onDisconnect?: () => void
      onError?: (message: string, error?: any) => void
    }

    type Middleware<T> = (ctx: Context) => Context<T>
  }
}
