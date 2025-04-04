import { useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import type { Eip1193Provider } from 'ethers'
import * as constants from 'helpers/constants'
import notifications from 'modules/notifications'

import networks from '../networks'

import messages from '../../../messages'


type Input = {
  supportedNetworkIds: NetworkIds[]
  configState: ConfigProvider.ConfigState
  onError?: ConfigProvider.Callbacks['onError']
}

const useChangeChain = (values: Input) => {
  const { configState, supportedNetworkIds, onError } = values
  const { dataRef, setData } = configState

  const {
    setNotificationTimeout,
    clearNotificationTimeout,
  } = notifications.useNotificationTimeout({
    handlersOnly: true,
  })

  return useCallback(async (networkId: NetworkIds): Promise<void> => {
    const { activeWallet, connector } = dataRef.current

    const isValid = supportedNetworkIds.includes(networkId)

    if (!isValid) {
      return Promise.reject(`Network ${networkId} is not supported`)
    }

    const chainId = networks.chainById[networkId]
    const isMonitorAddress = activeWallet === constants.walletNames.monitorAddress

    if (!dataRef.current.address || isMonitorAddress) {
      setData({ networkId })

      return
    }

    if (!connector) {
      return Promise.reject('The connector has not been connected')
    }

    const appConnectorNames: WalletIds[] = [
      constants.walletNames.walletConnect,
      constants.walletNames.coinbase,
      constants.walletNames.zenGo,
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
    supportedNetworkIds,
    setNotificationTimeout,
    clearNotificationTimeout,
    setData,
    onError,
  ])
}


export default useChangeChain
