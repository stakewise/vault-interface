import { useMemo } from 'react'

import useAPY from './useAPY'
import useAssets from './useAssets'
import useShares from './useShares'
import useHealthStatus from './useHealthStatus'
import useBoostedShares from './useBoostedShares'

import type { Input, Position } from './types'


const usePosition = (values: Input) => {
  const APY = useAPY(values)
  const assets = useAssets(values)
  const shares = useShares(values)
  const healthStatus = useHealthStatus(values)
  const boostedShares = useBoostedShares(values)

  return useMemo<Position[]>(() => {
    const result = [ APY ]

    if (boostedShares) {
      result.push(boostedShares)
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
  }, [ APY, assets, shares, healthStatus, boostedShares ])
}


export default usePosition
