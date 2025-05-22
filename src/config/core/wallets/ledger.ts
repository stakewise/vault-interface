import { Network } from 'sdk'
import apiUrls from 'helpers/methods/apiUrls'

import { Location } from './types'
import networks from '../config/util/networks'
import type { Input } from '../connectors/LedgerConnector'

import messages from '../messages'


const params = Object.values(networks.configs).reduce((acc, config) => {
  const url = apiUrls.getWeb3Url(config.chainId)

  return {
    ...acc,
    [config.chainId]: {
      chainId: config.chainId,
      name: config.name,
      url,
    },
  }
}, {} as Input)

const getConnector = async (chainId: Network) => {
  const LedgerConnector = (await import('../connectors/LedgerConnector')).default

  return new LedgerConnector({ params, chainId })
}

const ledger = {
  id: 'ledger',
  title: 'Ledger',
  logo: 'connector/ledger',
  isAddTokenEnabled: false,
  isInjectedWallet: false,
  isLocalStorageSave: true,
  isDisableSwitchChain: false,
  activationMessage: messages.authMessages.waitingAuth,
  networks: [
    Network.Mainnet,
    Network.Gnosis,
    Network.Chiado,
    Network.Hoodi,
  ] as ChainIds[],
  location: IS_LIGHTWEIGHT_MODE
    ? [] as Location
    : [ 'desktop' ] as Location,
  getConnector,
} as const


export default ledger
