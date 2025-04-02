import { useEffect } from 'react'
import cookie from 'helpers/cookie'
import * as constants from 'helpers/constants'
import { localStorage } from 'sdk'

import networks from './networks'


const useStorageUpdate = (configState: ConfigProvider.ConfigState) => {
  const { networkId, address, activeWallet, autoConnectChecked } = configState.data

  const chainId = networks.chainById[networkId]

  // Update cookie network
  useEffect(() => {
    const isSupportedNetwork = networks.ids.includes(networkId as any) && (
      IS_PROD ? !networks.configs[networkId].isTestnet : true
    )

    if (autoConnectChecked && isSupportedNetwork) {
      cookie.set(constants.cookieNames.networkId, networkId)
    }
  }, [ networkId, chainId, autoConnectChecked ])

  // Update localStorage wallet name
  useEffect(() => {
    if (autoConnectChecked) {
      if (activeWallet) {
        const isCustomBrowsers = [
          constants.walletNames.walletConnect,
          constants.walletNames.dAppBrowser,
          constants.walletNames.gnosisSafe,
          // @ts-ignore
        ].includes(activeWallet)

        if (!isCustomBrowsers) {
          localStorage.setItem(constants.localStorageNames.walletName, activeWallet)
        }
      }
      else {
        localStorage.removeItem(constants.localStorageNames.walletName)
      }
    }
  }, [ activeWallet, autoConnectChecked ])

  // Update localStorage readonly address
  useEffect(() => {
    const isMonitorAddress = activeWallet === constants.walletNames.monitorAddress

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
