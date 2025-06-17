import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConfig } from 'config'
import addresses from 'helpers/contracts/addresses'
import { StakeStep } from 'helpers/enums'

import useStakeApprove from './useStakeApprove'


type Input = {
  field: Forms.Field<bigint>
  swapToken: SwapToken
  vaultAddress: string | null
}

const useStakeApproveGas = (values: Input) => {
  const { field, swapToken, vaultAddress } = values

  const { sdk, chainId, address, isGnosis } = useConfig()
  const [ approveGas, setApproveGas ] = useState<bigint>(0n)

  const swapApprove = useStakeApprove({
    field,
    step: StakeStep.SwapApprove,
    recipient: addresses[chainId].cow.vaultRelayer,
    tokenAddress: swapToken.address,
    skip: !swapToken.address,
  })

  const stakeApprove = useStakeApprove({
    field,
    step: StakeStep.Approve,
    recipient: vaultAddress as string,
    tokenAddress: sdk.config.addresses.tokens.depositToken,
    skip: !isGnosis || !vaultAddress,
  })

  const getApproveGas = useCallback(async () => {
    let approveGas = 0n

    if (address) {
      const [ swapApproveGas, stakeApproveGas ] = await Promise.all([
        swapApprove.isRequired ? swapApprove.getGas() : Promise.resolve(0n),
        stakeApprove.isRequired ? stakeApprove.getGas() : Promise.resolve(0n),
      ])

      approveGas = swapApproveGas + stakeApproveGas
    }

    setApproveGas(approveGas)
  }, [ address, swapApprove, stakeApprove ])

  useEffect(() => {
    getApproveGas()
  }, [ getApproveGas ])

  return useMemo(() => ({
    approveGas,
    swapApprove,
    stakeApprove,
  }), [
    approveGas,
    swapApprove,
    stakeApprove,
  ])
}


export default useStakeApproveGas
