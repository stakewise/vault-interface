import { useMemo } from 'react'
import { useConfig, wallets } from 'config'

import useStore from '../data/useStore'
import useToken from './useToken'


type Input = {
  token: ReturnType<typeof useToken>['data']
  transactionPrice: bigint
}

const storeSelector = (store: Store) => ({
  nativeTokenBalance : store.account.balances.nativeToken,
})

const useMaxAmount = (values: Input) => {
  const { token, transactionPrice } = values

  const { activeWallet, isGnosis } = useConfig()
  const { nativeTokenBalance } = useStore(storeSelector)

  return useMemo(() => {
    if (token?.address) {
      return token.balance
    }

    const isGnosisSafeWallet = activeWallet === wallets.gnosisSafe.id

    if (isGnosis || isGnosisSafeWallet) {
      return nativeTokenBalance
    }

    const maxAmount = nativeTokenBalance - (transactionPrice * 2n)

    return maxAmount > 0n ? maxAmount : 0n
  }, [ token, activeWallet, transactionPrice, nativeTokenBalance, isGnosis ])
}


export default useMaxAmount
