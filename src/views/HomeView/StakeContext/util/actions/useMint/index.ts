import { useMemo } from 'react'

import useSubmit from './useSubmit'
import useHealth from './useHealth'
import useEstimateGas, { Type } from '../useEstimateGas'


type Output = {
  getStyleByHealth: ReturnType<typeof useHealth>['getStyleByHealth']
  getHealthFactor: ReturnType<typeof useHealth>['getHealthFactor']
  getMintGas: ReturnType<typeof useEstimateGas>
  submit: ReturnType<typeof useSubmit>
}

interface Hook {
  (params: Vault.Params): Output
  mock: Output
}

const useMint: Hook = (params) => {
  const submit = useSubmit(params)
  const getMintGas = useEstimateGas(Type.Mint)
  const { getStyleByHealth, getHealthFactor } = useHealth()

  return useMemo(() => ({
    getStyleByHealth,
    getHealthFactor,
    getMintGas,
    submit,
  }), [
    getStyleByHealth,
    getHealthFactor,
    getMintGas,
    submit,
  ])
}

useMint.mock = {
  ...useHealth.mock,
  getMintGas: useEstimateGas.mock,
  submit: () => Promise.resolve(undefined),
}


export default useMint
