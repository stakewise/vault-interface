import { useMemo } from 'react'

import useSubmit from './useSubmit'
import useMaxStake from './useMaxStake'
import useDepositTokenApprove from './useDepositTokenApprove'
import useEstimateGas, { Type } from '../useEstimateGas'


type Output = {
  isSubmitting: boolean
  getDepositGas: ReturnType<typeof useEstimateGas>
  getMaxStake: ReturnType<typeof useMaxStake>
  submit: ReturnType<typeof useSubmit>
  depositToken: ReturnType<typeof useDepositTokenApprove>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const useStake: Hook = (params) => {
  const depositToken = useDepositTokenApprove(params.vaultAddress)

  const { submit, isSubmitting } = useSubmit(params)
  const getDepositGas = useEstimateGas(Type.Deposit)
  const getMaxStake = useMaxStake({ getDepositGas })

  return useMemo(() => ({
    isSubmitting,
    depositToken,
    submit,
    getMaxStake,
    getDepositGas,
  }), [
    isSubmitting,
    depositToken,
    submit,
    getMaxStake,
    getDepositGas,
  ])
}

useStake.mock = {
  isSubmitting: false,
  depositToken: useDepositTokenApprove.mock,
  getDepositGas: useEstimateGas.mock,
  getMaxStake: () => Promise.resolve(0n),
  submit: () => Promise.resolve(undefined),
}


export default useStake
