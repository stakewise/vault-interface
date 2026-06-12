import { useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import type { Eip1193Provider } from 'ethers'
import notifications from 'modules/notifications'

import wallets from '../../../wallets'

import messages from '../../../messages'


type Input = {
  networks: ConfigProvider.Networks
  supportedNetworkIds: NetworkIds[]
  configState: ConfigProvider.ConfigState
  onError?: ConfigProvider.Callbacks['onError']
  onChangeChain: () => void
}

const useChangeChain = (values: Input) => {
  const { networks, configState, supportedNetworkIds, onError, onChangeChain } = values
  const { dataRef, setData } = configState

  const {
    setNotificationTimeout,
    clearNotificationTimeout,
  } = notifications.useNotificationTimeout({
    handlersOnly: true,
  })

  return useCallback(async (networkId: string): Promise<void> => {
    const { activeWallet, walletConnectData, connector } = dataRef.current

    const isValid = supportedNetworkIds.includes(networkId as NetworkIds)

    if (!isValid) {
      return Promise.reject(`Network ${networkId} is not supported`)
    }

    const isWalletSupportedChain = activeWallet
      ? (wallets[activeWallet].networks as number[]).includes(networks.chainById[networkId])
      : true

    if (!isWalletSupportedChain) {
      return Promise.reject(`The ${activeWallet} wallet does not support the ${networkId} network`)
    }

    const chainId = networks.chainById[networkId]
    const isWalletConnect = activeWallet === wallets.walletConnect.id
    const isMonitorAddress = activeWallet === wallets.monitorAddress.id

    if (!dataRef.current.address || isMonitorAddress) {
      onChangeChain()
      setData({ networkId })

      return
    }

    if (!connector) {
      return Promise.reject('The connector has not been connected')
    }

    if (isWalletConnect && Array.isArray(walletConnectData?.chains)) {
      const isSupported = walletConnectData.chains.includes(chainId)

      if (!isSupported && !walletConnectData.support.addChain) {
        notifications.open({
          text: messages.connectErrors.networkError,
          thread: 'connect',
          type: 'error',
        })

        return
      }
    }

    const appConnectorNames: WalletIds[] = [
      wallets.walletConnect.id,
      wallets.coinbase.id,
      wallets.binance.id,
    ]

    const needAppConfirmation = appConnectorNames.includes(activeWallet as WalletIds)

    if (needAppConfirmation) {
      setNotificationTimeout({
        text: messages.switchNetwork,
        time: 4000,
      })
    }

    try {
      await connector.changeChainId(chainId)

      const provider = await connector.getProvider()
      const library = new BrowserProvider(provider as Eip1193Provider)

      if (needAppConfirmation) {
        clearNotificationTimeout()
      }

      onChangeChain()
      setData({ library, networkId })
    }
    catch (error: any) {
      if (typeof onError === 'function') {
        onError('Wallet change chain error', error)
      }

      if (needAppConfirmation) {
        clearNotificationTimeout()
      }

      return Promise.reject(error)
    }
  }, [
    dataRef,
    networks,
    supportedNetworkIds,
    setNotificationTimeout,
    clearNotificationTimeout,
    onChangeChain,
    setData,
    onError,
  ])
}


export default useChangeChain
