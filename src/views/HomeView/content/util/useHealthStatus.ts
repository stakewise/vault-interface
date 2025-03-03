import { useCallback, useMemo, useRef } from 'react'
import { useFieldListener, useObjectState, useStore } from 'hooks'
import { commonMessages, requests } from 'helpers'
import { OsTokenPositionHealth } from 'sdk'
import { useConfig } from 'config'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import type { Input } from './types'


type Item = {
  title: Intl.Message | string
  hidden?: boolean
  isFetching?: boolean
  textValue?: {
    prev: {
      message: string
      dataTestId?: string
    }
    next: {
      message?: string
      dataTestId?: string
    }
  }
}

const hide: Item = {
  title: {},
  hidden: true,
}

const storeSelector = (store: Store) => ({
  stakedAssets: store.vault.user.balances.stake.assets,
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
  mintedAssets: store.vault.user.balances.mintToken.minted.assets,
  hasMintBalance: store.vault.user.balances.mintToken.hasMintBalance,
})

const useHealthStatus = ({ field, type }: Input) => {
  const { sdk } = useConfig()
  const { mint } = stakeCtx.useData()

  const {
    mintedShares,
    mintedAssets,
    stakedAssets,
    hasMintBalance,
  } = useStore(storeSelector)

  const initialStateRef = useRef({
    newStakedAssets: stakedAssets,
    newMintedAssets: mintedAssets,
    isFetching: false,
  })

  const [ { newStakedAssets, newMintedAssets, isFetching }, setState ] = useObjectState(initialStateRef.current)

  const fetchHealthStatus = useCallback(async (value: bigint) => {
    if (type === 'stake') {
      return {
        newStakedAssets: stakedAssets + (value as bigint || 0n),
      }
    }

    if (type === 'burn') {
      const amount = mintedShares - (value as bigint || 0n)

      const newMintedAssets = await requests.increaseDelay({
        handler: async () => sdk.osToken.getAssetsFromShares({ amount }),
        minTime: 650,
      })

      return {
        newMintedAssets,
      }
    }
  }, [ sdk, type, stakedAssets, mintedShares ])

  const formatStatus = useCallback((stakedAssets: bigint, mintedAssets: bigint) => {
    const { health } = mint.getHealthFactor(mintedAssets, stakedAssets)
    const { text, color } = mint.getStyleByHealth(health)

    return {
      message: text,
      health,
      color,
    }
  }, [ mint ])

  const handleFetchHealthStatus = useCallback(async (field: Forms.Field<bigint>) => {
    const inputValue = field.value
    const isValid = Number(inputValue) && !field.error

    if (!isValid) {
      setState(initialStateRef.current)

      return
    }

    setState({ isFetching: true })

    const newState = await fetchHealthStatus(BigInt(inputValue || 0))

    if (inputValue === field.value) {
      setState({ ...newState, isFetching: false })
    }
  }, [ fetchHealthStatus, setState ])

  useFieldListener(field, handleFetchHealthStatus, 300)

  return useMemo(() => {
    if (type === 'stake' || type === 'burn') {
      if (!hasMintBalance) {
        return hide
      }

      const prevStatus = formatStatus(stakedAssets, mintedAssets)
      const isHealthy = prevStatus.health === OsTokenPositionHealth.Healthy

      if (isHealthy) {
        // If the current status is Healthy, the user will not
        // be able to change it with their actions through the UI
        return hide
      }

      const nextStatus = formatStatus(newStakedAssets, newMintedAssets)

      let prev: NonNullable<Item['textValue']>['prev'] = {
        message: prevStatus.message,
        color: prevStatus.color,
        dataTestId: 'health',
      }

      let next: NonNullable<Item['textValue']>['next'] = {
        dataTestId: 'health',
      }

      if (nextStatus.message !== prev.message) {
        next.message = nextStatus.message
        next.color = nextStatus.color
      }

      return {
        title: {
          ...commonMessages.mintTokenStatus,
          values: { mintToken: sdk.config.tokens.mintToken },
        },
        textValue: {
          prev,
          next,
        },
        isFetching,
      }
    }

    return null
  }, [
    sdk,
    type,
    mintedAssets,
    stakedAssets,
    hasMintBalance,
    newStakedAssets,
    newMintedAssets,
    isFetching,
    formatStatus,
  ])
}


export default useHealthStatus
