import { numberToHex, ProviderRpcError, SwitchChainError, UserRejectedRequestError } from 'viem'
import type { SafeAppProvider } from '@safe-global/safe-apps-provider'
import type { WalletConnectParameters } from '@wagmi/connectors'
import { ChainNotConfiguredError } from '@wagmi/core'
import { walletConnect } from '@wagmi/connectors'
import apiUrls from 'sw-methods/apiUrls'

import { WagmiConnector, chains } from './helpers'
import networks from '../../config/util/networks'


type Provider = {
  request: (params: any) => Promise<any>
}

type WalletLinkConnectorType = WagmiConnector['connector'] & {
  getNamespaceChainsIds(): number[]
  getNamespaceMethods(): string[]
  getRequestedChainsIds(): Promise<number[]>
}

class WalletLinkConnector extends WagmiConnector {

  constructor(values: WalletConnectParameters) {
    const creator = walletConnect(values)

    super({ creator })

    this.connector.switchChain = this.switchChain.bind(this)
  }

  async waitForTimeout(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ timeoutError: true }), timeout)
    })
  }

  async getProvider() {
    const provider = await this.connector.getProvider() as SafeAppProvider

    // @ts-ignore
    const isGnosisSafe = provider.session.peer.metadata.name === 'Safe{Wallet}'

    if (isGnosisSafe) {
      const method = provider.request

      provider.request = async (data) => {
        const response = await method.bind(provider)(data)

        const isSafeHash = (
          response
          && typeof response === 'string'
          && response.startsWith('0x')
          && response.length > 50
        )

        if (isSafeHash) {
          const safeHash = response

          try {
            while (true) {
              let timer = 0

              const safeAPI = 'https://safe-transaction-gnosis-chain.safe.global/api/v1/multisig-transactions'
              const response = await fetch(`${safeAPI}/${safeHash}`)

              if (!response.ok) {
                throw new Error('')
              }

              const data = await response.json()

              if (data.transactionHash) {
                return data.transactionHash
              }
              else {
                await new Promise((r) => setTimeout(r, 3000))
                ++timer

                if (timer > 10) {
                  timer = 0

                  return response
                }
              }
            }
          }
          catch {
            return response
          }
        }

        return response
      }

      return provider
    }

    return provider
  }

  async addChain(chainId: number): Promise<any> {
    try {
      const provider = await this.getProvider()

      if (provider) {
        const networkId = networks.idByChain[chainId as ChainIds]

        const network = networks.configs[networkId]

        const url = apiUrls.getWeb3UrlWithoutQuiknode(chainId)

        await (provider as any).request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              blockExplorerUrls: [ network.blockExplorerUrl ],
              nativeCurrency: network.nativeCurrency,
              chainId: network.hexadecimalChainId,
              rpcUrls: [ url ],
              chainName: network.name,
            },
          ],
        })

        const currentChainId = await this.connector.getChainId()

        if (currentChainId !== chainId) {
          return this.switchChain({ chainId, timeout: 2000 })
        }

        return Promise.resolve()
      }
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  async switchChain({ chainId, timeout }: { chainId: number, timeout?: number }) {
    const chain = chains.find((chain) => chain.id === chainId)

    if (!chain) {
      throw new SwitchChainError(new ChainNotConfiguredError())
    }

    try {
      const provider = await this.getProvider()

      const result = await Promise.race([
        (provider as Provider).request({
          method: 'wallet_switchEthereumChain',
          params: [ { chainId: numberToHex(chainId) } ],
        }),
        timeout ? this.waitForTimeout(timeout) : new Promise(() => {}),
      ])

      if (result?.timeoutError) {
        await this.switchChain({ chainId })
      }

      return chain
    }
    catch (error) {
      const message = typeof error === 'string' ? error : (error as ProviderRpcError)?.message

      if (/unrecognized chain/i.test(message)) {
        return this.addChain(chainId)
      }
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error as Error)
      }

      throw new SwitchChainError(error as Error)
    }
  }
}


export default WalletLinkConnector
