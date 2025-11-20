import type { BrowserProvider } from 'ethers'

import useCancelOnChange from './util/useCancelOnChange'
import type { Subscription } from './util/useWallet/useCallsOnChange'


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
      changeChain: (networkId: NetworkIds) => Promise<void>
      connect: (walletName: WalletIds,  transport?: 'usb' | 'ble') => Promise<void>
      subscribeBeforeChange: Subscription
      unsubscribeBeforeChange: Subscription
    }

    type Context<T = {}> = T & State & {
      wallet: Wallet
      chainId: ChainIds
      isReadOnlyMode: boolean
      cancelOnChange: ReturnType<typeof useCancelOnChange>
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
