import { walletTitles } from 'helpers/constants'

import messages from '../../../messages'


const getSpecialErrors = (error: any) => {
  const errorMessage = (error as Error)?.message

  if ('method wallet_switchEthereumChain not found') {
    return messages.connectErrors.switchError
  }
  if ('method wallet_addEthereumChain not found') {
    return messages.connectErrors.addError
  }
  if (/unsupported chain id/i.test(errorMessage)) {
    return messages.connectErrors.chainIdError
  }
  if (/user rejected the request/i.test(errorMessage)) {
    return messages.connectErrors.authorize
  }

  return null
}


export default {
  activationMessage: messages.authMessages.waitingAuthByQR,
  name: walletTitles.walletConnect,
  getSpecialErrors,
} as const
