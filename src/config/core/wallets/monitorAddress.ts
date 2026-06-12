import { Network } from 'sdk'

import { Location } from './types'


const getConnector = async () => null

const monitorAddress = {
  id: 'monitorAddress',
  title: 'Check wallet',
  logo: 'connector/monitorAddress',
  isAutoConnect: false,
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: true,
  isDisableSwitchChain: false,
  activationMessage: null,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Hoodi,
  ] as ChainIds[],
  location: [ 'desktop', 'mobile' ] as Location,
  getConnector,
} as const


export default monitorAddress
