import { useMemo } from 'react'

import useSubmit from './useSubmit'
import useCalculateBurn from './useCalculateBurn'
import useEstimateGas, { Type } from '../useEstimateGas'


type Output = {
  submit: ReturnType<typeof useSubmit>
  getBurnGas: ReturnType<typeof useEstimateGas>
  calculateBurn: ReturnType<typeof useCalculateBurn>
}

interface Hook {
  (params: Vault.Params): Output
  mock: Output
}

const useBurn: Hook = (params) => {
  const submit = useSubmit(params)
  const calculateBurn = useCalculateBurn()
  const getBurnGas = useEstimateGas(Type.Burn)

  return useMemo(() => ({
    submit,
    getBurnGas,
    calculateBurn,
  }), [
    submit,
    getBurnGas,
    calculateBurn,
  ])
}

useBurn.mock = {
  getBurnGas: useEstimateGas.mock,
  submit: () => Promise.resolve(undefined),
  calculateBurn: () => Promise.resolve(0n),
}

export default useBurn
