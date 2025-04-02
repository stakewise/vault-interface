import { configs } from 'sdk'
import { injected } from '@wagmi/connectors'
import type { InjectedParameters } from '@wagmi/connectors'

import { WagmiConnector } from './helpers'
import networks from '../../config/util/networks'


type InjectedProvider = {
  request: (values: {
    method: string
    params?: any[]
  }) => Promise<any>
}

class InjectedConnector extends WagmiConnector {
  constructor({ target, shimDisconnect }: InjectedParameters) {
    const creator = injected({ target, shimDisconnect })

    super({ creator })
  }

  async activate(networkId: NetworkIds): Promise<any> {
    const connectorChainId = await this.connector.getChainId()
    const chainId = networks.chainById[networkId]

    // fix to prevent infinite promise on super.activate
    if (chainId !== connectorChainId) {
      await this.changeChainId(chainId)
    }

    return super.activate(networkId)
  }

  async changeChainId(chainId: ChainIds): Promise<any> {
    try {
      const provider = await this.getProvider() as InjectedProvider

      if (!provider) {
        throw new Error('Provider not found')
      }

      const config = configs[chainId]

      if (!config) {
        throw new Error(`Config for "${chainId} chain" not found`)
      }

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [ { chainId: config.network.hexadecimalChainId } ],
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
