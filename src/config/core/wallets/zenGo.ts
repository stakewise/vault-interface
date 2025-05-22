import { Network } from 'sdk'

import { Location } from './types'

import messages from '../messages'


const getConnector = async () => {
  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID) {
    throw new Error("You need to provide NEXT_PUBLIC_WALLET_CONNECT_ID env variable")
  }

  const WalletLinkConnector = (await import('../connectors/WalletLinkConnector')).default

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

const zenGo = {
  id: 'zenGo',
  title: 'ZenGo',
  logo: 'connector/zengo',
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: true,
  isDisableSwitchChain: true,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
  ] as ChainIds[],
  location: [ 'desktop' ] as Location,
  getConnector,
} as const


export default zenGo
