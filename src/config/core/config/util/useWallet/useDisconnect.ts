import { useCallback } from 'react'
import { localStorage } from 'sdk'
import intl from 'modules/intl'
import * as constants from 'helpers/constants'
import notifications from 'modules/notifications'

import wallets from '../../../wallets'

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

      if (activeWallet !== wallets.monitorAddress.id) {
        await connector?.deactivate()
      }

      if (typeof onDisconnect === 'function') {
        onDisconnect()
      }

      const { networkId: _, ...rest } = initialData

      setData({
        ...rest,
        library: undefined,
        autoConnectChecked: true,
      })

      localStorage.removeItem(constants.localStorageNames.walletName)

      if (activeWallet) {
        const { title } = wallets[activeWallet]
        const wallet = intlRef.current.formatMessage(title as Intl.MessageTranslation)

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
