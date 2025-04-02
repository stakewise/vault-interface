import { walletTitles } from 'helpers/constants'

import messages from '../../messages'


const getSpecialErrors = (error: any) => {
  const errorMessage = (error as Error)?.message

  if (errorMessage === 'User denied account authorization') {
    return messages.connectErrors.authorize
  }

  return null
}

const getConnector = async (chainId: ChainIds) => {
  const CoinbaseConnector = (await import('../custom-connectors/CoinbaseConnector')).default

  const connector = new CoinbaseConnector(chainId)

  return connector
}


export default {
  activationMessage: messages.authMessages.waitingAuthByQR,
  name: walletTitles.coinbase,
  getSpecialErrors,
  getConnector,
} as const
