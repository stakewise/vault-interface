import { useCallback, useEffect } from 'react'
import * as constants from 'helpers/constants'
import { localStorage } from 'sdk'
import { isAddress } from 'ethers'

import wallets from '../../../wallets'


const _getSavedActiveWallet = (): WalletIds | null => {
  const localStorageName = constants.localStorageNames.walletName
  const savedActiveWallet = localStorage.getItem<WalletIds>(localStorageName)

  const isValid = savedActiveWallet && Object
    .values(wallets)
    .map(({ id }) => id)
    .includes(savedActiveWallet)

  if (isValid) {
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

    const isMonitorAddress = savedActiveWallet === wallets.monitorAddress.id

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
  networks: ConfigProvider.Networks
}

const useAutoConnect = (values: UseAutoConnectProps) => {
  const { connect, networks, configState } = values

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
    const isLedgerLive = window.ethereum?.isLedgerLive
    const isDAppBrowser = !isDesktop && hasInjectedProvider
    const isLedger = activeWallet === wallets.ledger.id
    const isBinance = hasInjectedProvider && window.ethereum?.isBinance
    const isMonitorAddress = activeWallet === wallets.monitorAddress.id

    // ATTN: The order in this code is important!

    if (isFrame) {
      const gnosisConnector = await wallets.gnosisSafe.getConnector(undefined as any, { networks }) as any
      const isGnosisSafeApp = await gnosisConnector.isSafeApp()

      if (isGnosisSafeApp) {
        connect(wallets.gnosisSafe.id)
      }
    }
    else if (isBinance) {
      connect(wallets.binance.id)
    }
    else if (isLedgerLive) {
      connect(wallets.ledgerLive.id)
    }
    else if (isDAppBrowser) {
      connect(wallets.dAppBrowser.id)
    }
    else if (isLedger) {
      connect(wallets.ledger.id)
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
  }, [ networks, connect, setData ])

  useEffect(() => {
    if (configState.data.autoConnectChecked) {
      return
    }

    const savedState = _getSavedState(configState.initialData)

    handleAutoConnect(savedState)
  }, [ handleAutoConnect, configState.initialData, configState.data.autoConnectChecked ])
}


export default useAutoConnect
