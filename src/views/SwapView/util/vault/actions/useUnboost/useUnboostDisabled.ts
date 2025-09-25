import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'

import messages from './messages'


const isEnvUnboostDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_UNBOOST)

const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  isBalancesFetching: store.vault.user.balances.isFetching,
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

const useUnboostDisabled = () => {
  const { address, isReadOnlyMode } = useConfig()

  const {
    boostedShares,
    exitingPercent,
    isBalancesFetching,
  } = useStore(storeSelector)

  const isBoostQueued = exitingPercent > 0

  const isUnboostDisabled = (
    !address
    || isBoostQueued
    || isReadOnlyMode
    || !boostedShares
    || isEnvUnboostDisabled
    || isBalancesFetching
  )

  let unboostTooltip: Intl.Message | undefined = undefined

  if (isBoostQueued && boostedShares) {
    unboostTooltip = messages.unboostDisabled
  }

  return useMemo(() => ({
    unboostTooltip,
    isUnboostDisabled,
  }), [
    unboostTooltip,
    isUnboostDisabled,
  ])
}


export default useUnboostDisabled
