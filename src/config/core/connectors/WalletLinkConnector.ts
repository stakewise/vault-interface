import { numberToHex, ProviderRpcError, SwitchChainError, UserRejectedRequestError } from 'viem'
import type { SafeAppProvider } from '@safe-global/safe-apps-provider'
import type { WalletConnectParameters } from '@wagmi/connectors'
import { ChainNotConfiguredError } from '@wagmi/core'
import { walletConnect } from '@wagmi/connectors'

import { WagmiConnector } from './helpers'


const initialWalletData = {
  name: null,
  iconUrl: null,
  chains: [],
  support: {
    eip712: false,
    addChain: false,
    switchChanin: false,
  },
}

type Provider = {
  request: (params: any) => Promise<any>
}

type Input = WalletConnectParameters & {
  networks: ConfigProvider.Networks
}

class WalletLinkConnector extends WagmiConnector {
  walletData: ConfigProvider.WalletConnectData = initialWalletData
  networks: ConfigProvider.Networks

  constructor(values: Input) {
    const { networks, ...rest } = values

    const creator = walletConnect(rest)

    super({ creator, networks })

    this.networks = networks
    this.connector.switchChain = this.switchChain.bind(this)
  }

  async waitForTimeout(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ timeoutError: true }), timeout)
    })
  }

  async activate(networkId: string, _locale?: string, isReconnecting = false) {
    return super.activate(networkId, _locale, isReconnecting)
      .then(async () => {
        const provider = await this.connector.getProvider() as any

        const walletName = provider?.session?.peer?.metadata?.name || null
        const walletIcons = provider?.session?.peer?.metadata?.icons || []

        const supportedChains = Object.values(this.networks.default).map(({ chainId }) => chainId)

        const chains = (provider?.signer?.namespaces?.eip155?.chains || [])
          .map((value = '') => Number(value.replace('eip155:', '')))
          .filter((chainId: number) => supportedChains.includes(chainId))

        const methods = provider?.signer?.namespaces?.eip155?.methods || []

        const support = {
          eip712: methods.includes('eth_signTypedData_v4'),
          addChain: methods.includes('wallet_addEthereumChain'),
          switchChanin: methods.includes('wallet_switchEthereumChain'),
        }

        this.walletData = {
          iconUrl: walletIcons[0] || null,
          name: walletName,
          support,
          chains,
        }
      })
  }

  async deactivate() {
    return super.deactivate()
      .finally(() => this.walletData = initialWalletData)
  }

  getWalletData() {
    return this.walletData
  }

  async getProvider() {
    const provider = await this.connector.getProvider() as SafeAppProvider

    // @ts-ignore
    const isGnosisSafe = provider?.session?.peer?.metadata?.name === 'Safe{Wallet}'

    if (isGnosisSafe) {
      const method = provider.request

      const chainId = provider.chainId

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

              const chainNames: Record<number, string> = {
                1: 'eth',
                100: 'gno',
              }

              const chainName = chainNames[chainId]

              const safeAPI = `https://api.safe.global/tx-service/${chainName}/api/v1/multisig-transactions`

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
    const networkId = this.networks.idByChain[chainId as number]
    const chain = this.networks.configs[networkId as string]

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
