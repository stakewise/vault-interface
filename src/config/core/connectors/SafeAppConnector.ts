import { safe } from '@wagmi/connectors'
import notifications from 'modules/notifications'
import type { SafeAppProvider } from '@safe-global/safe-apps-provider'
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk'

import { WagmiConnector } from './helpers'

import messages from '../messages'


type Input = {
  networks: ConfigProvider.Networks
}

class SafeAppConnector extends WagmiConnector {
  private sdk: SafeAppsSDK

  constructor({ networks }: Input) {
    const creator = safe()

    super({ creator, networks })

    this.sdk = new SafeAppsSDK()
  }

  async activate() {
    return this.connector.connect()
  }

  async changeChainId(): Promise<any> {
    notifications.open({
      type: 'error',
      text: messages.connectErrors.switchError,
    })
  }

  async handleGetProvider(count: number = 0): Promise<SafeAppProvider> {
    try {
      const provider = await this.connector.getProvider()

      return provider as SafeAppProvider
    }
    catch (error: any) {
      const nextCount = count + 1

      if (nextCount < 10) {
        await new Promise((resolve) => setTimeout(resolve, nextCount * 100))

        return this.handleGetProvider(nextCount)
      }

      return Promise.reject(error)
    }
  }

  async getProvider() {
    const provider = await this.handleGetProvider() as SafeAppProvider

    const method = provider.request

    provider.request = async (data) => {
      const response = await method.bind(provider)(data)

      const safeHash = response?.hash

      if (safeHash) {
        try {
          while (true) {
            const tx = await this.sdk.txs.getBySafeTxHash(safeHash)

            const isInvalidHash = (
              tx.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS
              || tx.txStatus === TransactionStatus.AWAITING_EXECUTION
            )

            if (isInvalidHash) {
              // tx.txHash is null here
              await new Promise((r) => setTimeout(r, 3000))
            }
            else {
              return {
                ...response,
                hash: tx.txHash, // this is real tx hash
              }
            }
          }
        }
        catch {
          // getBySafeTxHash can catch error if hash is real and not a safeTxHash
          return response
        }
      }

      return response
    }

    return provider
  }

  async isSafeApp(): Promise<boolean> {
    // check if we're in an iframe
    if (window?.parent === window) {
      return false
    }

    try {
      const provider = await this.handleGetProvider()

      return Boolean(provider)
    }
    catch {
      return false
    }
  }
}


export default SafeAppConnector
