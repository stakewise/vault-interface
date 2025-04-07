import { useCallback, useRef } from 'react'
import methods from 'helpers/methods'
import intl from 'modules/intl'
import type { Eip1193Provider } from 'ethers'
import * as constants from 'helpers/constants'
import { localStorage } from 'sdk'
import notifications from 'modules/notifications'
import { getAddress, BrowserProvider } from 'ethers'

import networks from '../networks'
import connectors from '../../../connectors'

import messages from '../../../messages'


type Input = Pick<ConfigProvider.Callbacks, 'onError' | 'onStartConnect' | 'onConnectError' | 'onFinishConnect'> & {
  configState: ConfigProvider.ConfigState
}

const useConnect = (values: Input) => {
  const {
    configState,
    onError,
    onStartConnect,
    onConnectError,
    onFinishConnect,
  } = values

  const intlRef = intl.useIntlRef()
  const inProgressRef = useRef(false)
  const { dataRef, setData } = configState
  const timerRef = useRef<NodeJS.Timeout>()

  const connectWallet = useCallback(async (walletName: WalletIds): Promise<void> => {
    let resetConnectTimer: NodeJS.Timeout | null = null

    if (inProgressRef.current) {
      return
    }

    inProgressRef.current = true

    const {
      name,
      activationMessage,
      getSpecialErrors,
      getConnector,
    } = connectors[walletName]

    let { chainId, name: chainName } = networks.configs[dataRef.current.networkId]

    const connector = await getConnector(chainId) as Connectors

    if (!connector) {
      throw new Error(`The ${walletName} wallet does not have a connector`)
    }

    const isInjected = methods.isInjectedWallet(walletName)
    const isGnosisSafe = walletName === constants.walletNames.gnosisSafe
    const isWalletConnect = walletName === constants.walletNames.walletConnect

    try {
      if (isInjected) {
        const injectedProvider = methods.getInjectedProvider(walletName)

        if (!injectedProvider) {
          inProgressRef.current = false
          setData({ autoConnectChecked: true })
          localStorage.removeItem(constants.localStorageNames.walletName)

          return
        }

        // Sometimes MM may not react to autoconnect
        resetConnectTimer = setTimeout(() => {
          notifications.open({
            type: 'error',
            text: messages.connectErrors.unknown,
            thread: 'connect',
          })

          localStorage.removeItem(constants.localStorageNames.walletName)
          onConnectError()

          window.location.reload()
        }, 10_000)
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

      const data = await connector.activate(dataRef.current.networkId)

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

      const wallet = intlRef.current.formatMessage(name as Intl.MessageTranslation)

      notifications.open({
        type: 'success',
        text: {
          ...messages.successConnect,
          values: { wallet },
        },
        thread: 'connect',
      })

      onFinishConnect()

      if (resetConnectTimer) {
        clearTimeout(resetConnectTimer)
      }

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
      clearTimeout(timerRef.current)
    }
    catch (error: any) {
      console.log(error)

      inProgressRef.current = false

      onConnectError()

      if (typeof onError === 'function') {
        onError('Wallet activate error', error)
      }

      connector.deactivate()

      if (resetConnectTimer) {
        clearTimeout(resetConnectTimer)
      }

      if (isWalletConnect) {
        localStorage.clearAll()
      }

      const injectedProvider = methods.getInjectedProvider(walletName)

      // @ts-ignore
      const isLocked = !injectedProvider?._state?.isUnlocked
      const isAlreadyProcessing = error?.code === -32002
      const needLoginToMetaMask = isLocked || isAlreadyProcessing
      const isCancelAutoconnectSwitchChain = error.code === 4001 && !dataRef.current.address

      if (needLoginToMetaMask) {
        notifications.open({
          type: 'info',
          text: messages.connectErrors.injectedLogin,
          thread: 'connect',
        })

        return new Promise((resolve, reject) => {
          const timeout = setTimeout(reject, 8_000)

          const handleUpdate = async (values: { account?: string }) => {
            const { account } = values

            if (account) {
              connectWallet(walletName)
                .then(resolve)
                .catch(reject)
                .finally(() => clearTimeout(timeout))
            }

            connector.events?.unsubscribe('change', handleUpdate)
          }

          connector.events?.subscribe('change', handleUpdate)
        })
      }

      const specialError = typeof getSpecialErrors === 'function'
        ? getSpecialErrors(error)
        : null

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
  }, [
    intlRef,
    dataRef,
    setData,
    onError,
    onConnectError,
    onStartConnect,
    onFinishConnect,
  ])

  return connectWallet
}


export default useConnect
