import { useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { useFiatValues } from 'hooks'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


type Input = {
  isSwapQuoteFetching: boolean
}

const useStakeNetworkCost = ({ isSwapQuoteFetching }: Input) => {
  const { sdk } = useConfig()
  const { stake } = stakeCtx.useData()

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: formatEther(stake.gas.deposit + stake.gas.approve),
      isMinimal: true,
    },
  })

  return useMemo(() => ({
    title: commonMessages.transaction.networkCost,
    textValue: {
      prev: {
        message: fiatGas.formattedValue,
        icon: 'icon/gas',
      },
      next: {},
    },
    tooltip: {
      ...commonMessages.tooltip.gas,
      values: {
        nativeToken: sdk.config.tokens.nativeToken,
      },
    },
    isFetching: isSwapQuoteFetching,
  }), [ sdk, fiatGas, isSwapQuoteFetching ])
}


export default useStakeNetworkCost
