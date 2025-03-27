import { useCallback, useMemo, useRef } from 'react'
import { useFieldListener, useObjectState, useStore } from 'hooks'
import { commonMessages, constants } from 'helpers'
import { useConfig } from 'config'
import { BigDecimal } from 'sdk'
import methods from 'sw-methods'

import type { Input, Position } from './types'

import messages from './messages'


type Item = Position

const storeSelector = (store: Store) => ({
  mintTokenAPY: store.mintToken.apy,
  vaultAPY: store.vault.base.data.apy,
  feePercent: store.mintToken.feePercent,
  userAPY: store.vault.user.balances.userAPY,
  stakedAssets: store.vault.user.balances.stake.assets,
  boostedShares: store.vault.user.balances.boost.shares,
  isV2Version: store.vault.base.data.versions.isV2Version,
  ltvPercent: store.vault.base.data.osTokenConfig.ltvPercent,
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
  maxBoostApy: store.vault.user.balances.boost.osTokenHolderMaxBoostApy,
  unboostExitingShares: store.vault.user.unboostQueue.data.exitingShares,
})

const getAnnualReward = (assets: bigint, apy: number) => BigInt(
  new BigDecimal(apy)
    .divide(100)
    .multiply(assets)
    .decimals(0)
    .toString()
)

const useAPY = ({ field, type }: Input) => {
  const { sdk } = useConfig()

  const {
    userAPY,
    vaultAPY,
    feePercent,
    ltvPercent,
    isV2Version,
    maxBoostApy,
    mintedShares,
    mintTokenAPY,
    stakedAssets,
    boostedShares,
    unboostExitingShares,
  } = useStore(storeSelector)

  console.log({ userAPY, vaultAPY, maxBoostApy })

  const initialStateRef = useRef({
    newAPY: userAPY,
    isFetching: false,
  })

  const [ { newAPY, isFetching }, setState ] = useObjectState(initialStateRef.current)

  const convertToAssets = useCallback((shares: bigint) => (
    sdk.contracts.base.mintTokenController.convertToAssets(shares)
  ), [ sdk ])

  const getAPY = useCallback(async (value: bigint) => {
    // Do not subtract boostedShares since we continue to earn rewards
    // while the position is in the queue, so the api should not change
    const isUnboost = type === 'unboost'

    if (!value || isUnboost) {
      return userAPY
    }

    let newStakedAssets = stakedAssets,
        newMintedShares = mintedShares,
        newBoostedShares = boostedShares

    if (type === 'stake') {
      newStakedAssets += value
    }

    if (type === 'unstake' && isV2Version) {
      // In the v1 and v3 version of the vaults we continue to earn rewards
      // while the position is in the queue, so the api shouldn't change
      newStakedAssets -= value
    }

    if (type === 'mint') {
      newMintedShares += value
    }

    if (type === 'burn') {
      newMintedShares -= value
    }

    if (type === 'boost') {
      newBoostedShares += value
    }

    let totalEarnedAssets = getAnnualReward(newStakedAssets, vaultAPY)

    if (unboostExitingShares) {
      newBoostedShares += unboostExitingShares
    }

    if (newMintedShares) {
      const newMintedAssets = await convertToAssets(newMintedShares)

      const numerator = new BigDecimal(feePercent)
        .multiply(Number(mintTokenAPY))
        .multiply(constants.blockchain.amount1)
        .decimals(6)
        .toNumber()

      const denominator = new BigDecimal(10_000)
        .minus(feePercent)
        .multiply(ltvPercent)
        .decimals(6)
        .toNumber()

      if (denominator !== 0) {
        totalEarnedAssets -= getAnnualReward(newMintedAssets, numerator / denominator)
      }
    }

    if (newBoostedShares) {
      const newBoostedAssets = await convertToAssets(newBoostedShares)

      totalEarnedAssets += getAnnualReward(newBoostedAssets, maxBoostApy)
      totalEarnedAssets -= getAnnualReward(newBoostedAssets, Number(mintTokenAPY))

      if (newBoostedShares > newMintedShares) {
        const extraShares = newBoostedShares - newMintedShares
        const extraAssets = await convertToAssets(extraShares)

        totalEarnedAssets += getAnnualReward(extraAssets, Number(mintTokenAPY))
        newStakedAssets += extraAssets
      }
    }

    if (newStakedAssets <= 0) {
      return 0
    }

    return new BigDecimal(totalEarnedAssets)
      .divide(newStakedAssets)
      .multiply(100)
      .decimals(3)
      .toNumber()
  }, [
    type,
    userAPY,
    vaultAPY,
    ltvPercent,
    feePercent,
    maxBoostApy,
    isV2Version,
    mintedShares,
    stakedAssets,
    mintTokenAPY,
    boostedShares,
    unboostExitingShares,
    convertToAssets,
  ])

  const handleGetAPY = useCallback(async (field: Forms.Field<bigint>) => {
    const inputValue = field.value
    const isValid = Number(inputValue) && !field.error

    if (!isValid) {
      setState(initialStateRef.current)

      return
    }

    setState({ isFetching: true })

    const newAPY = await getAPY(BigInt(inputValue || 0))

    if (inputValue === field.value) {
      setState({ newAPY, isFetching: false })
    }
  }, [ getAPY, setState ])

  useFieldListener(field, handleGetAPY, 300)

  return useMemo(() => {
    const prev: NonNullable<Item['textValue']>['prev'] = {
      message: methods.formatApy(userAPY),
      dataTestId: 'apy',
    }

    const next: NonNullable<Item['textValue']>['next'] = {
      dataTestId: 'apy',
    }

    const formattedAPY = methods.formatApy(newAPY)

    if (formattedAPY !== prev.message) {
      next.message = formattedAPY
    }

    const result: Item = {
      title: commonMessages.apy,
      textValue: {
        prev,
        next,
      },
      tooltip: {
        ...messages.tooltips.apy,
        values: {
          depositToken: sdk.config.tokens.depositToken,
        },
      },
      isFetching,
    }

    return result
  }, [ sdk, userAPY, newAPY, isFetching ])
}


export default useAPY
