import { useMemo } from 'react'
import { useConfig } from 'config'
import methods from 'helpers/methods'
import { parseUnits } from 'ethers'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Position as Item } from 'views/HomeView/content/util'
import messages from 'views/HomeView/content/util/messages'


const useStakeRate = () => {
  const { sdk } = useConfig()
  const { stake } = stakeCtx.useData()

  const { getBuyAmount, isSwapQuoteFetching } = stake
  const selectedToken = stake.swapTokens.selected

  return useMemo(() => {
    if (!selectedToken.address) {
      return null
    }

    const rateAmount = getBuyAmount(parseUnits('1', selectedToken.units))

    return {
      title: commonMessages.transaction.exchangeRate,
      textValue: {
        prev: {
          message: `1 ${selectedToken.name} = ${methods.formatTokenValue(rateAmount)} ${sdk.config.tokens.depositToken}`,
        },
        next: {},
      },
      tooltip: {
        ...messages.tooltips.rate,
        values: {
          swapToken: selectedToken.name,
          depositToken: sdk.config.tokens.depositToken,
        },
      },
      isFetching: isSwapQuoteFetching,
    } as Item
  }, [ sdk, selectedToken, isSwapQuoteFetching ])
}


export default useStakeRate
