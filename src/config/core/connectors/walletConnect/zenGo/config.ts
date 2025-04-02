import { walletTitles } from 'sw-helpers/constants'

import messages from '../../../messages'


const getSpecialErrors = (error: any) => {
  const errorMessage = (error as Error)?.message

  if (/unsupported chain id/i.test(errorMessage)) {
    return messages.connectErrors.chainIdError
  }
  else if (/user rejected the request/i.test(errorMessage)) {
    return messages.connectErrors.authorize
  }

  return null
}


export default {
  activationMessage: messages.authMessages.waitingAuthByQR,
  name: walletTitles.zenGo,
  getSpecialErrors,
} as const
