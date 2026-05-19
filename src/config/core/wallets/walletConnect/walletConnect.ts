import { Network } from 'sdk'

import { Location } from '../types'

import getConnector from './getConnector'

import messages from '../../messages'


const walletConnect = {
  id: 'walletConnect',
  title: 'WalletConnect',
  logo: 'connector/walletConnect',
  isAutoConnect: false,
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: true,
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
