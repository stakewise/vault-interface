import { injected, coinbaseWallet, walletConnect, safe } from '@wagmi/connectors'
import EventAggregator from 'modules/event-aggregator'
import type { Chain } from 'viem/chains'


type Creators = ReturnType<
  typeof injected
  | typeof coinbaseWallet
  | typeof walletConnect
  | typeof safe
>

type Input = {
  creator: Creators
  networks: ConfigProvider.Networks
}

class WagmiConnector {
  events: EventAggregator
  connector: ReturnType<Creators>
  networks: ConfigProvider.Networks

  emitter = {
    emit: (type: string, data: any) => {
      const isAccounts = Boolean(data?.accounts?.length)

      let params = data

      if (isAccounts) {
        params = { account: data.accounts[0] }
      }

      this.events.dispatch(type, params)
    },
    listenerCount: () => 0,
    once: () => {},
  }

  constructor(values: Input) {
    this.networks = values.networks
    this.events = new EventAggregator()

    const chains: Chain[] = Object.values(this.networks.default).map(({ viem, id }) => {
      const { rpc } = this.networks.configs[id]

      const chain: Chain = { ...viem }

      // Inside wagmi there is use of contracts as a helper, it looks dangerous, better to remove it
      delete chain.contracts

      chain.rpcUrls.default.http = Array.isArray(rpc) ? rpc : [ rpc ]

      return chain
    })

    this.connector = values.creator({
      // @ts-ignore
      chains,
      // @ts-ignore
      emitter: this.emitter,
    })
  }

  async getProvider() {
    return this.connector.getProvider()
  }

  async deactivate() {
    return this.connector.disconnect()
  }

  async getChainId() {
    return this.connector.getChainId()
  }

  async getAccount() {
    const accounts = await this.connector.getAccounts()

    return accounts[0]
  }

  async activate(networkId: string, _locale?: string, isReconnecting = false) {
    const chainId = this.networks.chainById[networkId]

    try {
      const data = await this.connector.connect({
        chainId,
        // ATTN https://github.com/wevm/wagmi/blob/main/packages/core/src/connectors/injected.ts#L167
        isReconnecting,
      })

      return data
    }
    catch (error: any) {
      const errorCode = error?.data?.originalError?.code || error?.code
      const isUnrecognizedChain = errorCode === 4902

      return isUnrecognizedChain
        ? this.addChain(chainId)
        : Promise.reject(error)
    }
  }

  async addChain(chainId: number): Promise<any> {
    try {
      const provider = await this.connector.getProvider()

      if (provider) {
        const networkId = this.networks.idByChain[chainId as number]

        const {
          rpc,
          name,
          nativeCurrency,
          blockExplorerUrl,
          hexadecimalChainId,
        } = this.networks.configs[networkId]

        await (provider as any).request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: name,
              chainId: hexadecimalChainId,
              nativeCurrency: nativeCurrency,
              blockExplorerUrls: [ blockExplorerUrl ],
              rpcUrls: Array.isArray(rpc) ? rpc : [ rpc ],
            },
          ],
        })

        // the same logic as in the coinbase wallet, to avoid infinite network switch
        const currentChainId = await this.connector.getChainId()

        if (currentChainId !== chainId && typeof this.connector.switchChain === 'function') {
          return this.connector.switchChain({ chainId })
        }

        return Promise.resolve()
      }
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  async changeChainId(chainId: number): Promise<any> {
    try {
      if (typeof this.connector.switchChain === 'function') {
        await this.connector.switchChain({ chainId })
      }
    }
    catch (error: any) {
      const errorCode = error?.data?.originalError?.code || error?.code
      const isUnrecognizedChain = errorCode === 4902

      return isUnrecognizedChain
        ? this.addChain(chainId)
        : Promise.reject(error)
    }
  }
}


export default WagmiConnector
