import { useCallback } from 'react'
import intl from 'sw-modules/intl'
import { walletNames } from 'helpers/constants'
import notifications from 'sw-modules/notifications'

import connectors from '../../../connectors'

import messages from '../../../messages'


type Input = {
  configState: ConfigProvider.ConfigState
  onError?: ConfigProvider.Callbacks['onError']
  onDisconnect?: () => void
}

const useDisconnect = (values: Input) => {
  const { configState, onError, onDisconnect } = values
  const { dataRef, initialData, setData } = configState

  const intlRef = intl.useIntlRef()

  return useCallback(async () => {
    try {
      const { activeWallet, connector } = dataRef.current

      if (activeWallet !== walletNames.monitorAddress) {
        await connector?.deactivate()
      }

      if (typeof onDisconnect === 'function') {
        onDisconnect()
      }

      const { networkId, ...rest } = initialData

      setData({
        ...rest,
        library: undefined,
        autoConnectChecked: true,
      })

      if (activeWallet) {
        const { name } = connectors[activeWallet]
        const wallet = intlRef.current.formatMessage(name as Intl.MessageTranslation)

        notifications.open({
          type: 'success',
          text: { ...messages.successDisconnect, values: { wallet } },
          thread: 'connect',
        })
      }
    }
    catch (error: any) {
      if (typeof onError === 'function') {
        onError('Wallet deactivate error', error)
      }
    }
  }, [ intlRef, dataRef, initialData, onError, onDisconnect, setData ])
}


export default useDisconnect
