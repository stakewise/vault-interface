import { useEffect } from 'react'
import { localStorage } from 'sdk'
import cookie from 'helpers/cookie'
import * as constants from 'helpers/constants'

import wallets from '../../wallets'


type Input = {
  networks: ConfigProvider.Networks
  configState: ConfigProvider.ConfigState
}

const useStorageUpdate = ({ networks, configState }: Input) => {
  const { networkId, address, activeWallet, autoConnectChecked } = configState.data

  const chainId = networks.chainById[networkId]

  // Update cookie network
  useEffect(() => {
    const networkConfig = networks.configs[networkId]
    const isSupportedNetwork = Boolean(networkConfig) && (
      IS_PROD ? !networkConfig.isTestnet : true
    )

    if (autoConnectChecked && isSupportedNetwork) {
      cookie.set(constants.cookieNames.networkId, networkId)
    }
  }, [ networks, networkId, chainId, autoConnectChecked ])

  // Update localStorage wallet name
  useEffect(() => {
    if (autoConnectChecked) {
      if (activeWallet && wallets[activeWallet].isLocalStorageSave) {
        localStorage.setItem(constants.localStorageNames.walletName, activeWallet)
      }
      else {
        localStorage.removeItem(constants.localStorageNames.walletName)
      }
    }
  }, [ activeWallet, autoConnectChecked ])

  // Update localStorage readonly address
  useEffect(() => {
    const isMonitorAddress = activeWallet === wallets.monitorAddress.id

    if (!autoConnectChecked) {
      return
    }

    if (isMonitorAddress && address) {
      localStorage.setItem(constants.localStorageNames.savedReadOnlyAddress, address)
    }
    else {
      localStorage.removeItem(constants.localStorageNames.savedReadOnlyAddress)
    }
  }, [ address, activeWallet, autoConnectChecked ])
}


export default useStorageUpdate
