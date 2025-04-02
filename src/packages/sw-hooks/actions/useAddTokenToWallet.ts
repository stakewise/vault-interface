import { useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import notifications from 'modules/notifications'

import messages from './messages'


type CallbackInput = {
  image: string
  symbol: string
  address: string
}

const useAddTokenToWallet = (library?: BrowserProvider) => (
  useCallback((values: CallbackInput) => {
    library?.send('wallet_watchAsset', {
      type: 'ERC20',
      options: {
        decimals: 18,
        ...values,
      },
    })
    .then(() => notifications.open({
      type: 'success',
      text: { ...messages.addedToken, values: { symbol: values.symbol } },
    }))
  }, [ library ])
)


export default useAddTokenToWallet
