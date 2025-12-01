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

const walletConnect = {
  id: 'walletConnect',
  title: 'WalletConnect',
  logo: 'connector/walletConnect',
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: false,
  isDisableSwitchChain: false,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Hoodi,
  ] as ChainIds[],
  location: IS_LIGHTWEIGHT_MODE
    ? [] as Location
    : [ 'desktop', 'mobile' ] as Location,
  getConnector,
} as const


export default walletConnect
