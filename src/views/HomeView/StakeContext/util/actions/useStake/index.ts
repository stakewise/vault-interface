import { useMemo } from 'react'
import { useSwapTokens } from 'hooks'

import useSubmit from './useSubmit'
import useMaxStake from './useMaxStake'
import useDepositTokenApprove from './useDepositTokenApprove'
import useEstimateGas, { Type } from '../useEstimateGas'


type Input = StakePage.Params & {
  swapTokens: StakePage.SwapTokens
}

type Output = ReturnType<typeof useSubmit> & {
  swapTokens: ReturnType<typeof useSwapTokens>
  getDepositGas: ReturnType<typeof useEstimateGas>
  getMaxStake: ReturnType<typeof useMaxStake>
  depositToken: ReturnType<typeof useDepositTokenApprove>
}

interface Hook {
  (params: Input): Output
  mock: Output
}

const useStake: Hook = ({ swapTokens, ...params }) => {
  const depositToken = useDepositTokenApprove(params.vaultAddress)

  const { submit, isSubmitting } = useSubmit(params)
  const getDepositGas = useEstimateGas(Type.Deposit)
  const getMaxStake = useMaxStake({ getDepositGas })

  return useMemo(() => ({
    swapTokens,
    isSubmitting,
    depositToken,
    submit,
    getMaxStake,
    getDepositGas,
  }), [
    swapTokens,
    isSubmitting,
    depositToken,
    submit,
    getMaxStake,
    getDepositGas,
  ])
}

useStake.mock = {
  isSubmitting: false,
  swapTokens: useSwapTokens.mock,
  depositToken: useDepositTokenApprove.mock,
  getDepositGas: useEstimateGas.mock,
  getMaxStake: () => Promise.resolve(0n),
  submit: () => Promise.resolve(undefined),
}


export default useStake
