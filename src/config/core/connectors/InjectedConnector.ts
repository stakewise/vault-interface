import { injected } from '@wagmi/connectors'
import type { InjectedParameters } from '@wagmi/connectors'

import { WagmiConnector } from './helpers'


type Input = InjectedParameters & {
  networks: ConfigProvider.Networks
}

type InjectedProvider = {
  request: (values: {
    method: string
    params?: any[]
  }) => Promise<any>
}

class InjectedConnector extends WagmiConnector {

  constructor({ target, networks, shimDisconnect }: Input) {
    const creator = injected({ target, shimDisconnect })

    super({ creator, networks })
  }

  async activate(networkId: string): Promise<any> {
    const connectorChainId = await this.connector.getChainId()
    const chainId = this.networks.chainById[networkId]

    // fix to prevent infinite promise on super.activate
    // skip if wallet doesn't respond before connect (e.g. Infinex returns connectorChainId 0)
    if (connectorChainId && chainId !== connectorChainId) {
      await this.changeChainId(chainId)
    }

    return super.activate(networkId)
  }

  async changeChainId(chainId: number): Promise<any> {
    try {
      const provider = await this.getProvider() as InjectedProvider

      if (!provider) {
        throw new Error('Provider not found')
      }

      const networkId = this.networks.idByChain[chainId]
      const config = this.networks.configs[networkId]

      if (!config) {
        throw new Error(`Config for "${chainId} chain" not found`)
      }

      const hexadecimalChainId = config.hexadecimalChainId

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [ { chainId: hexadecimalChainId } ],
      })

      const hexChainId = await provider.request({
        method: 'eth_chainId',
      })

      return Number(hexChainId)
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


export default InjectedConnector
