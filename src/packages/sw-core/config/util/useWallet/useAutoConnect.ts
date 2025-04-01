import { useCallback, useEffect } from 'react'
import { localStorage } from 'sdk'
import * as constants from 'sw-helpers/constants'
import { isAddress } from 'ethers'

import connectors from '../../../connectors'


const _getSavedActiveWallet = (): WalletIds | null => {
  const localStorageName = constants.localStorageNames.walletName
  const savedActiveWallet = localStorage.getItem<WalletIds>(localStorageName)

  if (savedActiveWallet && Object.values(constants.walletNames).includes(savedActiveWallet)) {
    return savedActiveWallet
  }
  else {
    localStorage.removeItem(localStorageName)
  }

  return null
}

const _getSavedReadOnlyAddress = (): string | null => {
  const localStorageName = constants.localStorageNames.savedReadOnlyAddress
  const savedReadOnlyAddress = localStorage.getItem<string>(localStorageName)

  if (savedReadOnlyAddress && isAddress(savedReadOnlyAddress)) {
    return savedReadOnlyAddress
  }
  else {
    localStorage.removeItem(localStorageName)
  }

  return null
}

const _getSavedState = (initialState: ConfigProvider.State): ConfigProvider.State => {
  const savedState = {
    ...initialState,
    autoConnectChecked: true,
  }

  const savedActiveWallet = _getSavedActiveWallet()
  const savedReadOnlyAddress = _getSavedReadOnlyAddress()

  if (savedActiveWallet) {
    savedState.activeWallet = savedActiveWallet

    const isMonitorAddress = savedActiveWallet === constants.walletNames.monitorAddress

    if (isMonitorAddress) {
      if (savedReadOnlyAddress) {
        savedState.address = savedReadOnlyAddress
      }
      else {
        savedState.activeWallet = null
        localStorage.removeItem(constants.localStorageNames.walletName)
      }
    }
  }

  return savedState
}

type UseAutoConnectProps = {
  configState: ConfigProvider.ConfigState
  connect: ConfigProvider.Context['wallet']['connect']
}

const useAutoConnect = (values: UseAutoConnectProps) => {
  const { connect, configState } = values

  const { setData } = configState

  const handleAutoConnect = useCallback(async (savedState: ConfigProvider.State) => {
    const { activeWallet } = savedState

    let isFrame = false
    const hasInjectedProvider = Boolean(window.ethereum)

    try {
      isFrame = window.self !== window.top
    }
    catch {}

    const isDesktop = window.innerWidth >= 1000
    const isDAppBrowser = !isDesktop && hasInjectedProvider
    const isLedger = activeWallet === constants.walletNames.ledger
    const isMonitorAddress = activeWallet === constants.walletNames.monitorAddress

    // ATTN: The order in this code is important!

    if (isFrame) {
      const gnosisConnector = await connectors.gnosisSafe.getConnector()
      const isGnosisSafeApp = await gnosisConnector.isSafeApp()

      if (isGnosisSafeApp) {
        connect(constants.walletNames.gnosisSafe)
      }
    }
    else if (isDAppBrowser) {
      connect(constants.walletNames.dAppBrowser)
    }
    else if (isLedger) {
      connect(constants.walletNames.ledger)
    }
    else if (isMonitorAddress) {
      setData(savedState)
    }
    else if (activeWallet) {
      connect(activeWallet)
    }
    else {
      setData(savedState)
    }
  }, [ connect, setData ])

  useEffect(() => {
    const savedState = _getSavedState(configState.initialData)

    handleAutoConnect(savedState)
  }, [ handleAutoConnect, configState.initialData ])
}


export default useAutoConnect
