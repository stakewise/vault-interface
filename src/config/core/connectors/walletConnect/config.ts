import { walletNames } from 'helpers/constants'

import zenGoConfig from './zenGo/config'
import defaultWalletConnectConfig from './default/config'


const getConnector = async () => {
  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID) {
    throw new Error("You need to provide NEXT_PUBLIC_WALLET_CONNECT_ID env variable")
  }

  const WalletLinkConnector = (await import('../custom-connectors/WalletLinkConnector')).default

  const connector = new WalletLinkConnector({
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
    isNewChainsStale: true,
    showQrModal: true,
    qrModalOptions: {
      themeVariables: {
        '--wcm-z-index': '999',
      },
    },
  })

  return connector
}


export default {
  [walletNames.walletConnect]: {
    ...defaultWalletConnectConfig,
    getConnector,
  },
  [walletNames.zenGo]: {
    ...zenGoConfig,
    getConnector,
  },
} as const
