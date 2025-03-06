import { useMemo } from 'react'

import useSubmit from './useSubmit'
import useHealth from './useHealth'
import useEstimateGas, { Type } from '../useEstimateGas'


type Output = ReturnType<typeof useSubmit> & {
  getStyleByHealth: ReturnType<typeof useHealth>['getStyleByHealth']
  getHealthFactor: ReturnType<typeof useHealth>['getHealthFactor']
  getMintGas: ReturnType<typeof useEstimateGas>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const useMint: Hook = (params) => {
  const { submit, isSubmitting } = useSubmit(params)
  const getMintGas = useEstimateGas(Type.Mint)
  const { getStyleByHealth, getHealthFactor } = useHealth()

  return useMemo(() => ({
    isSubmitting,
    getStyleByHealth,
    getHealthFactor,
    getMintGas,
    submit,
  }), [
    isSubmitting,
    getStyleByHealth,
    getHealthFactor,
    getMintGas,
    submit,
  ])
}

useMint.mock = {
  ...useHealth.mock,
  getMintGas: useEstimateGas.mock,
  isSubmitting: false,
  submit: () => Promise.resolve(undefined),
}


export default useMint
