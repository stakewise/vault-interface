import { injected, coinbaseWallet, walletConnect, safe } from '@wagmi/connectors'
import { mainnet, gnosis, gnosisChiado } from 'viem/chains'
import EventAggregator from 'modules/event-aggregator'
import apiUrls from 'helpers/methods/apiUrls'
import type { Chain } from 'viem/chains'

import networks from '../../../config/util/networks'


const viemChains = [ mainnet, gnosis, gnosisChiado ]

const chains: Chain[] = []

networks.chains.forEach((chainId) => {
  const viemChain = viemChains.find((data) => data.id === Number(chainId))

  if (viemChain) {
    const result: Chain = { ...viemChain }
    const url = apiUrls.getWeb3Url(chainId)

    // Inside wagmi there is use of contracts as a helper, it looks dangerous, better to remove it
    delete result.contracts

    result.rpcUrls.default.http = Array.isArray(url) ? [ url[0] ] : [ url ]

    chains.push(result)
  }
})

type Creators = ReturnType<
  typeof injected
  | typeof coinbaseWallet
  | typeof walletConnect
  | typeof safe
>

type Input = {
  creator: Creators
}

class WagmiConnector {
  events: EventAggregator
  connector: ReturnType<Creators>

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
    this.events = new EventAggregator()

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

  async activate(networkId: NetworkIds) {
    const chainId = networks.chainById[networkId]

    try {
      const data = await this.connector.connect({
        chainId,
        // ATTN https://github.com/wevm/wagmi/blob/main/packages/core/src/connectors/injected.ts#L167
        isReconnecting: false,
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
        const networkId = networks.idByChain[chainId as ChainIds]

        const network = networks.configs[networkId]

        const url = apiUrls.getWeb3Url(chainId)

        await (provider as any).request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              blockExplorerUrls: [ network.blockExplorerUrl ],
              nativeCurrency: network.nativeCurrency,
              chainId: network.hexadecimalChainId,
              chainName: network.name,
              rpcUrls: [ url ],
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


export { chains }

export default WagmiConnector
