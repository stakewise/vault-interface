import { Network } from 'sdk'
import apiUrls from 'sw-methods/apiUrls'
import { walletTitles } from 'helpers/constants'

import networks from '../../config/util/networks'
import type { Input } from '../custom-connectors/LedgerConnector'

import messages from '../../messages'

// apiUrls!
const params = Object.values(networks.configs).reduce((acc, config) => {
  const url = apiUrls.getWeb3Url(config.chainId)

  return {
    ...acc,
    [config.chainId]: {
      chainId: config.chainId,
      name: config.name,
      url,
    },
  }
}, {} as Input)

const getSpecialErrors = (error: any) => {
  if (error && typeof error === 'object') {
    const errorMessage = (error as Error)?.message

    if (error.name === 'EthAppPleaseEnableContractData') {
      return messages.connectErrors.ledger.settings
    }

    if (error.name === 'TransportStatusError') {
      const statusCode = error.statusCode
      const isNotOpened = statusCode === 0x650f || statusCode === 0x6511

      return isNotOpened
        ? messages.connectErrors.ledger.notOpened
        : messages.connectErrors.ledger.lock
    }

    const isNotConnected = (
      errorMessage.indexOf('0x6804') !== -1
      || errorMessage.indexOf('U2F DEVICE_INELIGIBLE') !== -1
    )

    if (isNotConnected) {
      return messages.connectErrors.ledger.notConnected
    }
  }

  return null
}

const getConnector = async (chainId: Network) => {
  const LedgerConnector = (await import('../custom-connectors/LedgerConnector')).default

  return new LedgerConnector({ params, chainId })
}


export default {
  activationMessage: messages.authMessages.connectLedger,
  name: walletTitles.ledger,
  getSpecialErrors,
  getConnector,
} as const
