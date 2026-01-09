import { useCallback, useRef } from 'react'
import intl from 'modules/intl'
import { localStorage } from 'sdk'
import type { Eip1193Provider } from 'ethers'
import * as constants from 'helpers/constants'
import notifications from 'modules/notifications'
import { getAddress, BrowserProvider } from 'ethers'

import networks from '../networks'
import wallets from '../../../wallets'
import getSpecialErrors from '../getSpecialErrors'

import messages from '../../../messages'


type Input = Pick<ConfigProvider.Callbacks, 'onError' | 'onStartConnect' | 'onConnectError' | 'onFinishConnect'> & {
  configState: ConfigProvider.ConfigState
  disconnect: () => Promise<void>
}

const useConnect = (values: Input) => {
  const {
    configState,
    disconnect,
    onError,
    onStartConnect,
    onConnectError,
    onFinishConnect,
  } = values

  const intlRef = intl.useIntlRef()
  const inProgressRef = useRef(false)
  const { dataRef, setData } = configState

  const resetConnection = useCallback(() => {
    notifications.open({
      type: 'error',
      text: messages.connectErrors.unknown,
      thread: 'connect',
    })

    localStorage.removeItem(constants.localStorageNames.walletName)
    onConnectError()

    window.location.reload()
  }, [ onConnectError ])

  const connectWallet = useCallback(async (walletName: WalletIds, transport?: 'usb' | 'ble'): Promise<void> => {
    let resetConnectTimer: NodeJS.Timeout | null = null

    if (inProgressRef.current) {
      return
    }

    inProgressRef.current = true

    const {
      title,
      activationMessage,
      getConnector,
    } = wallets[walletName]

    const { name: chainName } = networks.configs[dataRef.current.networkId]
    let { chainId } = networks.configs[dataRef.current.networkId]

    const connector = await getConnector(chainId, {
      transport,
      disconnect,
    }) as Connectors

    if (!connector) {
      throw new Error(`The ${walletName} wallet does not have a connector`)
    }

    const isLedger = walletName === wallets.ledger.id
    const isInjected = wallets[walletName].isInjectedWallet
    const isGnosisSafe = walletName === wallets.gnosisSafe.id
    const isWalletConnect = walletName === wallets.walletConnect.id

    try {
      if (isInjected) {
        const injectedProvider = wallets[walletName].getProvider()

        if (!injectedProvider) {
          inProgressRef.current = false
          setData({ autoConnectChecked: true })
          localStorage.removeItem(constants.localStorageNames.walletName)

          return
        }

        // Sometimes MM may not react to autoconnect
        resetConnectTimer = setTimeout(resetConnection, 10_000)
      }

      if (isLedger) {
        resetConnectTimer = setTimeout(resetConnection, 10_000)
      }

      // In the safe app we need to resolve provider before next calls to avoid timeout error
      if (isGnosisSafe && typeof connector.handleGetProvider === 'function') {
        await connector.handleGetProvider()
      }

      if (activationMessage) {
        onStartConnect(activationMessage)
      }

      const connectorChainId = await connector.getChainId()

      if (isGnosisSafe) {
        chainId = connectorChainId

        const isSupported = networks.chains.includes(chainId)

        if (!isSupported) {
          notifications.open({
            type: 'error',
            text: messages.connectErrors.networkError,
            thread: 'connect',
          })

          return
        }
      }

      const data = await connector.activate(dataRef.current.networkId, intlRef.current.locale)

      if (Number(connectorChainId) !== chainId) {
        await connector.changeChainId(chainId)
      }

      const [ unFormattedAddress, provider ] = await Promise.all([
        data?.account || connector.getAccount(),
        connector.getProvider(),
      ])

      if (!unFormattedAddress) {
        onConnectError()

        if (typeof onError === 'function') {
          onError('Wallet activate error: Empty accounts!')
        }

        setData({ autoConnectChecked: true })

        localStorage.removeItem(constants.localStorageNames.walletName)
        inProgressRef.current = false

        notifications.open({
          text: messages.connectErrors.noAddress,
          type: 'error',
          thread: 'connect',
        })

        return
      }

      const address = unFormattedAddress && getAddress(unFormattedAddress)

      const library = new BrowserProvider(provider as Eip1193Provider, {
        name: chainName,
        chainId,
      })

      const wallet = intlRef.current.formatMessage(title as Intl.MessageTranslation)

      notifications.open({
        type: 'success',
        text: {
          ...messages.successConnect,
          values: { wallet },
        },
        thread: 'connect',
      })

      onFinishConnect()

      const networkId = networks.idByChain[chainId]

      setData({
        address,
        library,
        connector,
        networkId,
        activeWallet: walletName,
        autoConnectChecked: true,
      })

      inProgressRef.current = false
    }
    catch (error: any) {
      console.log(error)

      inProgressRef.current = false

      onConnectError()

      if (typeof onError === 'function') {
        onError('Wallet activate error', error)
      }

      connector.deactivate?.()

      if (isWalletConnect) {
        localStorage.clearAll()
      }

      const isCancelAutoconnectSwitchChain = error.code === 4001 && !dataRef.current.address

      const specialError = getSpecialErrors(error)

      let errorMessage = messages.connectErrors.unknown

      if (specialError) {
        errorMessage = specialError
      }

      if (isCancelAutoconnectSwitchChain) {
        errorMessage = messages.connectErrors.cancelledNetworkChange
      }

      setData({ autoConnectChecked: true })

      notifications.open({
        type: 'error',
        text: errorMessage,
        thread: 'connect',
      })

      return Promise.reject(error)
    }
    finally {
      if (resetConnectTimer) {
        clearTimeout(resetConnectTimer)
      }
    }
  }, [
    intlRef,
    dataRef,
    setData,
    onError,
    disconnect,
    resetConnection,
    onConnectError,
    onStartConnect,
    onFinishConnect,
  ])

  return connectWallet
}


export default useConnect
