import { walletTitles } from 'helpers/constants'

import messages from '../../../messages'


const getSpecialErrors = (error: any) => {
  const errorMessage = typeof error === 'string' ? error : error.message

  if (/no ethereum provider/i.test(errorMessage)) {
    return messages.connectErrors.noProvider
  }

  if (/user rejected the request/i.test(errorMessage)) {
    return messages.connectErrors.authorize
  }

  return null
}

const getConnector = async () => {
  const InjectedConnector = (await import('../../custom-connectors/InjectedConnector')).default

  const connector = new InjectedConnector({ shimDisconnect: false })

  return connector
}


export default {
  activationMessage: messages.authMessages.waitingAuth,
  name: walletTitles.dAppBrowser,
  getSpecialErrors,
  getConnector,
} as const
