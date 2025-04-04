import { useMemo } from 'react'
import { useStore } from 'hooks'

import useAPY from './useAPY'
import useAssets from './useAssets'
import useShares from './useShares'
import useHealthStatus from './useHealthStatus'
import useBoostedShares from './useBoostedShares'

import type { Input, Position } from './types'


const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  unboostPosition: store.vault.user.unboostQueue.data.position,
})

const usePosition = (values: Input) => {
  const APY = useAPY(values)
  const assets = useAssets(values)
  const shares = useShares(values)
  const healthStatus = useHealthStatus(values)
  const boostedInfo = useBoostedShares(values)

  const { unboostPosition, boostedShares } = useStore(storeSelector)

  return useMemo<Position[]>(() => {
    const result = []

    // ATTN - hide APY for boost/unboost actions and when user are already boosted
    const hideApy = Boolean(boostedShares || unboostPosition || values.type === 'boost' || values.type === 'unboost')

    if (!hideApy) {
      result.push(APY)
    }

    if (boostedInfo) {
      result.push(boostedInfo)
    }

    if (assets) {
      result.push(assets)
    }

    if (shares) {
      result.push(shares)
    }

    if (healthStatus) {
      result.push(healthStatus)
    }

    return result
  }, [ APY, assets, shares, healthStatus, boostedInfo, boostedShares, unboostPosition, values ])
}


export default usePosition
