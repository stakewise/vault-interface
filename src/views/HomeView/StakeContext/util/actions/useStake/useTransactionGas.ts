import { useMemo } from 'react'
import { useStakeApproveGas } from 'hooks'

import useDepositGas from './useDepositGas'


type Input = Pick<StakePage.Context, 'field' | 'vaultAddress'> & {
  swapToken: SwapToken
}

const useTransactionGas = (values: Input) => {
  const { field, swapToken, vaultAddress } = values

  const { approveGas, swapApprove, stakeApprove } = useStakeApproveGas({
    field,
    swapToken,
    vaultAddress,
  })

  const { depositGas } = useDepositGas({
    vaultAddress,
  })

  return useMemo(() => ({
    gas: {
      deposit: depositGas,
      approve: approveGas,
    },
    swapApprove,
    stakeApprove,
  }), [
    depositGas,
    approveGas,
    swapApprove,
    stakeApprove,
  ])
}


export default useTransactionGas
