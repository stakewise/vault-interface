import { useCallback } from 'react'
import { useFieldListener, useObjectState } from 'hooks'
import { useConfig } from 'config'
import { BigDecimal } from 'sdk'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


type ActionType = 'stake' | 'boost'

const initialState = {
  newAPY: 0,
  isFetching: false,
}

const getAnnualReward = (assets: bigint, apy: number) => BigInt(
  new BigDecimal(assets)
    .multiply(Math.round(apy * 100))
    .divide(10_000)
    .decimals(0)
    .toString()
)

const useAPY = (type: ActionType) => {
  const { signSDK, address } = useConfig()
  const { data, field, unboostQueue, vaultAddress } = stakeCtx.useData()

  const [ state, setState ] = useObjectState(initialState)

  const getAPY = useCallback(async () => {
    const fieldValue = (field.value || 0n)

    let newMintTokenShares = data.mintTokenBalance,
      newBoostedMintTokenShares = unboostQueue.exitingShares + data.boost.shares

    if (type === 'stake' && address) {
      const signer = await signSDK.provider.getSigner(address)
      const signedContract = signSDK.contracts.special.stakeCalculator.connect(signer)

      const { params } = await signSDK.vault.getHarvestParams({ vaultAddress })

      const { receivedOsTokenShares } = await signedContract.calculateStake.staticCall({
        stakeAssets: fieldValue,
        harvestParams: params,
        vault: vaultAddress,
        user: address,
      })

      newMintTokenShares += receivedOsTokenShares
    }

    if (type === 'boost') {
      newBoostedMintTokenShares += fieldValue
    }

    const balanceMintTokenAssets = await signSDK.contracts.base.mintTokenController.convertToAssets(newMintTokenShares)
    let totalEarnedAssets = getAnnualReward(balanceMintTokenAssets, data.apy.mintToken)

    let totalAssets = balanceMintTokenAssets

    if (newBoostedMintTokenShares) {
      const boostPositionMintTokenAssets = await signSDK.contracts.base.mintTokenController.convertToAssets(newBoostedMintTokenShares)
      totalAssets += boostPositionMintTokenAssets

      const boostEarnedAssets = getAnnualReward(boostPositionMintTokenAssets, data.apy.maxBoost)
      totalEarnedAssets += boostEarnedAssets
    }

    if (!totalAssets) {
      return 0
    }

    const totalAPY = new BigDecimal(totalEarnedAssets)
      .divide(totalAssets)
      .multiply(100)
      .decimals(3)
      .toNumber()

    return totalAPY
  }, [ address, vaultAddress, type, signSDK, data, unboostQueue, field ])

  const handleGetAPY = useCallback(async () => {
    const inputValue = field.value
    const isValid = Number(field.value) && !field.error

    if (!isValid) {
      setState(initialState)
      return
    }

    setState({ isFetching: true })

    const newAPY = await getAPY()

    if (inputValue === field.value) {
      setState({ newAPY, isFetching: false })
    }
  }, [ field, getAPY, setState ])

  useFieldListener(field, handleGetAPY, 0)

  return state
}


export default useAPY
