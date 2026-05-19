import type { BrowserProvider } from 'ethers'
import type { Chain } from 'viem/chains'

import useCancelOnChange from './util/useCancelOnChange'
import type { Subscription } from './util/useWallet/useCallsOnChange'


declare global {

  declare namespace ConfigProvider {

    type ConnectorData = {
      account?: string
      chainId?: number
    }

    type State = {
      networkId: string
      address: string | null
      library?: BrowserProvider
      accountName: string | null
      autoConnectChecked: boolean
      connector: Connectors | null
      activeWallet: WalletIds | null
      walletConnectData: WalletConnectData | null
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
      changeChain: (networkId: string) => Promise<void>
      connect: (walletName: WalletIds,  transport?: 'usb' | 'ble') => Promise<void>
      subscribeBeforeChange: Subscription
      unsubscribeBeforeChange: Subscription
    }

    type Context<T = {}> = T & State & {
      wallet: Wallet
      chainId: number
      isReadOnlyMode: boolean
      network: SupportedNetwork
      readOnlyProvider: StakeWise.Provider
      cancelOnChange: ReturnType<typeof useCancelOnChange>
    }

    type Callbacks = {
      onStartConnect: (activationMessage: Intl.Message | string) => void
      onChangeAddress?: () => void
      onFinishConnect: () => void
      onConnectError: () => void
      onChangeChain?: () => void
      onDisconnect?: () => void
      onError?: (message: string, error?: any) => void
    }

    type Middleware<T> = (ctx: Context, networks: Networks) => Context<T>

    type SupportedNetwork = {
      id: string
      name: string
      logo: string
      chainId: number
      rpc: string | string[]
      hexadecimalChainId: string
      blockExplorerUrl: string
      nativeCurrency: {
        name: string
        symbol: string
        decimals: number
      }
      viem: Chain
      isTestnet: boolean
    }

    type Networks = {
      configs: Record<string, SupportedNetwork>
      default: Record<number, SupportedNetwork>
      idByChain: Record<number, string>
      chainById: Record<string, number>
    }

    type WalletConnectData = {
      name: string | null
      iconUrl: string | null
      chains: Array<number>
      support: {
        eip712: boolean
        addChain: boolean
        switchChanin: boolean
      }
    }
  }
}
