import { useMemo } from 'react'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'
import { StakeStep } from 'helpers/enums'
import { swapHooks } from 'hooks'

import { StepsData } from 'components'


type Input = {
  isSwapApproveRequired: boolean
  isStakeApproveRequired: boolean
  swapTokens: ReturnType<typeof swapHooks.useTokens>
  cancelSwap: ReturnType<typeof swapHooks.useActions>['cancelSwap']
}

const useStakeSteps = (values: Input) => {
  const {
    swapTokens,
    isSwapApproveRequired,
    isStakeApproveRequired,
    cancelSwap,
  } = values

  const { sdk } = useConfig()

  const steps = useMemo<Record<string, StepsData[number]>>(() => ({
    stake: {
      id: StakeStep.Stake,
    },
    swap: {
      id: StakeStep.Swap,
      onCancel: cancelSwap,
    },
    swapApprove: {
      id: StakeStep.SwapApprove,
      title: {
        ...commonMessages.buttonTitle.approve,
        values: {
          token: swapTokens.sellToken.name,
        },
      },
    },
    stakeApprove: {
      id: StakeStep.Approve,
      title: {
        ...commonMessages.buttonTitle.approve,
        values: {
          token: sdk.config.tokens.depositToken,
        },
      },
    },
  }), [ sdk, swapTokens, cancelSwap ])

  return useMemo(() => {
    const result: StepsData = []

    if (isSwapApproveRequired) {
      result.push(steps.swapApprove)
    }

    if (swapTokens.sellToken.address) {
      result.push(steps.swap)
    }

    if (isStakeApproveRequired) {
      result.push(steps.stakeApprove)
    }

    result.push(steps.stake)

    return result
  }, [ steps, swapTokens, isSwapApproveRequired, isStakeApproveRequired ])
}


export default useStakeSteps
