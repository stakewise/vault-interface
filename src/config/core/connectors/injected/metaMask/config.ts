import { walletTitles } from 'helpers/constants'
import methods from 'sw-methods'

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

const target = () => {
  let provider = methods.getInjectedProvider('metaMask')

  // @ts-ignore
  const providers = provider?.providers

  if (providers?.length) {
    provider = providers.find((item: any) => item.isMetaMask)
  }

  return {
    id: 'metamask',
    name: 'MetaMask Provider',
    provider,
  }
}

const getConnector = async () => {
  const InjectedConnector = (await import('../../custom-connectors/InjectedConnector')).default

  //ATTN https://github.com/wevm/wagmi/blob/main/packages/core/src/connectors/injected.ts#L168
  const connector = new InjectedConnector({ target, shimDisconnect: false })

  return connector
}


export default {
  activationMessage: messages.authMessages.waitingAuth,
  name: walletTitles.metaMask,
  getSpecialErrors,
  getConnector,
} as const
