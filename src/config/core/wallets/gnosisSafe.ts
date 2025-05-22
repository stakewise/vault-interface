import { Network } from 'sdk'

import { Location } from './types'

import messages from '../messages'


const getConnector = async () => {
  const SafeAppConnector = (await import('../connectors/SafeAppConnector')).default

  const connector = new SafeAppConnector()

  return connector
}

const gnosisSafe = {
  id: 'gnosisSafe',
  title: 'Gnosis Safe',
  logo: 'connector/gnosisSafe',
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: false,
  isDisableSwitchChain: true,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
  ] as ChainIds[],
  location: IS_LIGHTWEIGHT_MODE
    ? [] as Location
    : [ 'mobile' ] as Location,
  getConnector,
} as const


export default gnosisSafe
