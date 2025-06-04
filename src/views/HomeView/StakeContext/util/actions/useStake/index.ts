import { useMemo } from 'react'
import { useSwapTokens } from 'hooks'

import useSubmit from './useSubmit'
import useMaxStake from './useMaxStake'
import useTransactionGas from './useTransactionGas'


type Input = StakePage.Params & {
  swapTokens: StakePage.SwapTokens
}

type Output =
  ReturnType<typeof useSubmit>
  & {
    gas: ReturnType<typeof useTransactionGas>['gas']
    swapTokens: ReturnType<typeof useSwapTokens>
    onMaxButtonClick: ReturnType<typeof useMaxStake>
  }

interface Hook {
  (params: Input): Output
  mock: Output
}

const useStake: Hook = ({ swapTokens, ...params }) => {
  const { field, vaultAddress } = params

  const { submit, isSubmitting } = useSubmit(params)

  const { gas, swapApprove, stakeApprove } = useTransactionGas({
    field,
    vaultAddress,
    swapToken: swapTokens.selected,
  })

  const onMaxButtonClick = useMaxStake({
    gas,
    field,
    swapToken: swapTokens.selected,
  })

  return useMemo(() => ({
    gas,
    swapTokens,
    isSubmitting,
    submit,
    onMaxButtonClick,
  }), [
    gas,
    swapTokens,
    isSubmitting,
    submit,
    onMaxButtonClick,
  ])
}

useStake.mock = {
  gas: {
    deposit: 0n,
    approve: 0n,
  },
  isSubmitting: false,
  swapTokens: useSwapTokens.mock,
  submit: () => Promise.resolve(undefined),
  onMaxButtonClick: () => Promise.resolve(0n),
}


export default useStake
