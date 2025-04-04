import type { Time } from 'lightweight-charts'
import { createVaultInterfaceStore } from 'store/entries/vault-interface'


declare global {
  type Store = ReturnType<(ReturnType<typeof createVaultInterfaceStore>)['getState']>

  interface EthereumProvider {
    isTaho: boolean
    isRabby: boolean
    isDapper: boolean
    isMetaMask: boolean
    isBraveWallet: boolean

    providers: EthereumProvider[]
    chainId?: string | number
    _chainId?: string | number
    netVersion?: string | number
    networkVersion?: string | number
    autoRefreshOnNetworkChange: boolean
    cachedResults: {
      net_version?: Record<'result', string | number>
    }

    request: (params: any) => Promise<any>
    enable: () => Promise<Record<string, string>>
    on: (type: string, method: (...args: any) => void) => void
    once: (type: string, method: (...args: any) => void) => void
    removeListener: (type: string, method: (...args: any) => void) => void
    send: (data: string | Record<string, string>) => Record<string, any> | Promise<Record<string, any>>
  }

  interface Navigator {
    brave?: {
      isBrave: () => Promise<boolean>
    }
  }

  interface Window {
    rabby: EthereumProvider
    taho: EthereumProvider
    okxwallet: EthereumProvider
    trustwallet: EthereumProvider
    braveEthereum: EthereumProvider
    ethereum?: EthereumProvider
    device: {
      isMobile: boolean
      isDesktop:boolean
    }
    navigator: Navigator
    onGemReady?: () => void
    e2e?: Record<string, any>
  }

  type Tab = {
    id: string
    title: Intl.Message | string
    isError?: boolean
  }

  type Config = StakeWise.Config
}
