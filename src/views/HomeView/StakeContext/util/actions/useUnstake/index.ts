import { useMemo } from 'react'

import useSubmit from './useSubmit'
import useEstimateGas, { Type } from '../useEstimateGas'


type Output = {
  getWithdrawGas: ReturnType<typeof useEstimateGas>
  submit: ReturnType<typeof useSubmit>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const useWithdraw: Hook = (params) => {
  const submit = useSubmit(params)
  const getWithdrawGas = useEstimateGas(Type.Withdraw)

  return useMemo(() => ({
    getWithdrawGas,
    submit,
  }), [
    getWithdrawGas,
    submit,
  ])
}

useWithdraw.mock = {
  getWithdrawGas: () => Promise.resolve(0n),
  submit: () => Promise.resolve(),
}


export default useWithdraw
