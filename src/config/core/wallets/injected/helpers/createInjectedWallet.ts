import type { Location, IsDisabled } from '../../types'

import { findProvider, findProviderIcon } from '../../../providers/eip6963'

import getInjectedConnector from './getInjectedConnector'

import messages from '../../../messages'


type InjectedWalletConfig = {
  id: string
  title: string
  rdns?: string
  logo?: string
  networks: number[]
  location?: Location
  isAutoConnect?: boolean
  isAddTokenEnabled?: boolean
  isLocalStorageSave?: boolean
  isDisableSwitchChain?: boolean
  fallbackProvider?: () => any
}

const createInjectedWallet = (config: InjectedWalletConfig) => {
  const {
    id,
    rdns,
    title,
    networks,
    isAutoConnect = false,
    isAddTokenEnabled = true,
    isLocalStorageSave = true,
    isDisableSwitchChain = false,
    location = [ 'desktop', 'mobile' ] as Location,
    fallbackProvider,
  } = config

  const getProvider = () => (rdns && findProvider(rdns)) || fallbackProvider?.()

  const logo = config.logo || (rdns && findProviderIcon(rdns))

  const target = () => ({
    id,
    name: `${title} Provider`,
    provider: getProvider(),
  })

  return {
    id,
    rdns,
    logo,
    title,
    networks,
    location,
    isAutoConnect,
    isAddTokenEnabled,
    isLocalStorageSave,
    isDisableSwitchChain,
    isInjectedWallet: true,
    activationMessage: messages.authMessages.waitingAuth,
    isDisabled: (() => !getProvider()) as IsDisabled,
    getConnector: getInjectedConnector({ target, shimDisconnect: false }),
    getProvider,
  }
}


export default createInjectedWallet
