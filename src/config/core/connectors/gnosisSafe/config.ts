import { walletTitles } from 'sw-helpers/constants'

import messages from '../../messages'


const getConnector = async () => {
  const SafeAppConnector = (await import('../custom-connectors/SafeAppConnector')).default

  const connector = new SafeAppConnector()

  return connector
}


export default {
  activationMessage: messages.authMessages.waitingAuth,
  name: walletTitles.gnosisSafe,
  getSpecialErrors: () => null,
  getConnector,
} as const
