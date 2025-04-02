import { safe } from '@wagmi/connectors'
import notifications from 'modules/notifications'
import type { SafeAppProvider } from '@safe-global/safe-apps-provider'
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk'

import { WagmiConnector } from './helpers'

import messages from '../../messages'


class SafeAppConnector extends WagmiConnector {
  private sdk: SafeAppsSDK

  constructor() {
    const creator = safe()

    super({ creator })

    this.sdk = new SafeAppsSDK()
  }

  async activate() {
    return this.connector.connect()
  }

  async changeChainId(chainId: number): Promise<any> {
    notifications.open({
      type: 'error',
      text: messages.connectErrors.switchError,
    })
  }

  async getProvider() {
    const provider = await this.connector.getProvider() as SafeAppProvider

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
          // getBySafeTxHash can catch error if hash if real and not a safeTxHash
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
      const provider = await this.connector.getProvider()

      return Boolean(provider)
    }
    catch {
      return false
    }
  }
}


export default SafeAppConnector
