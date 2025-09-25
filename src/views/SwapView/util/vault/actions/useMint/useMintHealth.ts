import { useCallback, useMemo, useRef } from 'react'
import { OsTokenPositionHealth } from 'sdk'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import type { TextColor } from 'components'


type PositionHealthStyle = {
  color: TextColor
  text: Intl.Message
}

type HealthFactor = {
  health: OsTokenPositionHealth
  value: number
}

const styles: Record<OsTokenPositionHealth, PositionHealthStyle> = {
  [OsTokenPositionHealth.Healthy]: {
    text: commonMessages.status.healthy,
    color: 'success',
  },
  [OsTokenPositionHealth.Moderate]: {
    text: commonMessages.status.moderate,
    color: 'warning',
  },
  [OsTokenPositionHealth.Unhealthy]: {
    text: commonMessages.status.unhealthy,
    color: 'error',
  },
  [OsTokenPositionHealth.Risky]: {
    text: commonMessages.status.risky,
    color: 'error',
  },
}

const storeSelector = (store: Store) => ({
  isFetching: store.vault.base.isFetching,
  liqThresholdPercent: BigInt(store.vault.base.data.osTokenConfig.liqThresholdPercent),
})

const useMintHealth = () => {
  const { sdk } = useConfig()
  const { liqThresholdPercent, isFetching } = useStore(storeSelector)

  const params = useMemo(() => ({
    liqThresholdPercent,
    isFetching,
  }), [
    liqThresholdPercent,
    isFetching,
  ])

  const paramsRef = useRef(params)
  paramsRef.current = params

  const getStyleByHealth = useCallback((health: OsTokenPositionHealth) => styles[health], [])

  const getHealthFactor = useCallback((
    mintedAssets: bigint,
    stakedAssets: bigint
  ): HealthFactor => {

    if (mintedAssets === 0n || stakedAssets === 0n || paramsRef.current.isFetching) {
      return {
        value: 0,
        health: OsTokenPositionHealth.Healthy,
      }
    }

    return sdk.osToken.getHealthFactor({ mintedAssets, stakedAssets, liqThresholdPercent })
  }, [ sdk, liqThresholdPercent ])

  return useMemo(() => ({
    getHealthFactor,
    getStyleByHealth,
  }), [
    getHealthFactor,
    getStyleByHealth,
  ])
}

useMintHealth.mock = {
  getStyleByHealth: () => styles[OsTokenPositionHealth.Healthy],
  getHealthFactor: () => ({ health: OsTokenPositionHealth.Healthy, value: 1.2 }),
}


export default useMintHealth
