import { useState, useCallback, useEffect } from 'react'
import { StakeStep } from 'helpers/enums'
import { constants } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import useStakeSteps from './useStakeSteps'
import useStakeApprove from './useStakeApprove'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

type Input = {
  stakeApprove: ReturnType<typeof useStakeApprove>
  swapApprove: ReturnType<typeof useStakeApprove>
  stepsData: ReturnType<typeof useStakeSteps>
}

const useStakeTransactionPrice = (values: Input) => {
  const { stakeApprove, swapApprove, stepsData } = values

  const { vaultAddress } = useStore(storeSelector)
  const { signSDK, address, isReadOnlyMode } = useConfig()

  const [ transactionPrice, setTransactionPrice ] = useState(0n)

  const isSkipFetch = !address || isReadOnlyMode || !vaultAddress

  const fetchStakeGas = useCallback(() => {
    return signSDK.vault.deposit.estimateGas({
      assets: constants.blockchain.minimalAmount,
      userAddress: address as string,
      vaultAddress,
    })
  }, [ signSDK, address, vaultAddress ])

  const fetchTransactionPrice = useCallback(async () => {
    if (isSkipFetch) {
      return
    }

    try {
      let gas = 0n

      const calls = {
        [StakeStep.Stake]: fetchStakeGas,
        [StakeStep.Approve]: stakeApprove.getApproveGas,
        [StakeStep.SwapApprove]: swapApprove.getApproveGas,
      } as const

      for (let i = 0; i < stepsData.length; i += 1) {
        const step = stepsData[i]

        const call = calls[step.id as keyof typeof calls]

        gas += await call?.()
      }

      setTransactionPrice(gas)
    }
    catch {
      setTransactionPrice(0n)
    }
  }, [
    stepsData,
    stakeApprove,
    swapApprove,
    isSkipFetch,
    fetchStakeGas,
  ])

  useEffect(() => {
    if (!isSkipFetch) {
      fetchTransactionPrice()
    }
  }, [ isSkipFetch, fetchTransactionPrice ])

  return transactionPrice
}


export default useStakeTransactionPrice
