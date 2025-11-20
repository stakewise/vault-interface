import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig, wallets } from 'config'

import { useSwapTokens } from './swap'


type Input = {
  swapTokens: ReturnType<typeof useSwapTokens>
  transactionPrice: bigint
}

const storeSelector = (store: Store) => ({
  depositTokenBalance : store.account.balances.depositToken,
})

const useStakeMaxAmount = (values: Input) => {
  const { swapTokens, transactionPrice } = values

  const { activeWallet, isGnosis } = useConfig()
  const { depositTokenBalance } = useStore(storeSelector)

  const maxStakeAmount = useMemo(() => {
    if (swapTokens.selected.address) {
      return swapTokens.selected.balance
    }

    const isGnosisSafeWallet = activeWallet === wallets.gnosisSafe.id

    if (isGnosis || isGnosisSafeWallet) {
      return depositTokenBalance
    }

    const maxAmount = depositTokenBalance - (transactionPrice * 2n)

    return maxAmount > 0n ? maxAmount : 0n
  }, [ swapTokens, activeWallet, transactionPrice, depositTokenBalance, isGnosis ])

  return maxStakeAmount
}


export default useStakeMaxAmount
