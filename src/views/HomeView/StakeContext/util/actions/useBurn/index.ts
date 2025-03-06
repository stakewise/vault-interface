import { useMemo } from 'react'

import useSubmit from './useSubmit'
import useCalculateBurn from './useCalculateBurn'
import useEstimateGas, { Type } from '../useEstimateGas'


type Output = ReturnType<typeof useSubmit> & {
  getBurnGas: ReturnType<typeof useEstimateGas>
  calculateBurn: ReturnType<typeof useCalculateBurn>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const useBurn: Hook = (params) => {
  const { submit, isSubmitting } = useSubmit(params)
  const calculateBurn = useCalculateBurn()
  const getBurnGas = useEstimateGas(Type.Burn)

  return useMemo(() => ({
    isSubmitting,
    submit,
    getBurnGas,
    calculateBurn,
  }), [
    isSubmitting,
    submit,
    getBurnGas,
    calculateBurn,
  ])
}

useBurn.mock = {
  getBurnGas: useEstimateGas.mock,
  isSubmitting: false,
  submit: () => Promise.resolve(undefined),
  calculateBurn: () => Promise.resolve(0n),
}

export default useBurn
