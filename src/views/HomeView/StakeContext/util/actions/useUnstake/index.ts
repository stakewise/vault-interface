import { useMemo } from 'react'

import useSubmit from './useSubmit'
import useEstimateGas, { Type } from '../useEstimateGas'


type Output = ReturnType<typeof useSubmit> & {
  getWithdrawGas: ReturnType<typeof useEstimateGas>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const useUnstake: Hook = (params) => {
  const { isSubmitting, submit } = useSubmit(params)
  const getWithdrawGas = useEstimateGas(Type.Withdraw)

  return useMemo(() => ({
    isSubmitting,
    getWithdrawGas,
    submit,
  }), [
    isSubmitting,
    getWithdrawGas,
    submit,
  ])
}

useUnstake.mock = {
  isSubmitting: false,
  getWithdrawGas: () => Promise.resolve(0n),
  submit: () => Promise.resolve(),
}


export default useUnstake
