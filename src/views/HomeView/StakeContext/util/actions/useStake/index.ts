import { useCallback, useMemo } from 'react'
import { useActions, useStakeSubmit, useSwapTokens } from 'hooks'
import { AllocatorActionType } from 'sdk'
import { useConfig } from 'config'
import { StakeStep } from 'helpers/enums'

import { Action, openTxCompletedModal, openTransactionsFlowModal } from 'layouts/modals'

import useMaxStake from './useMaxStake'
import useStakeGas from './useStakeGas'


type Input = StakePage.Params & {
  swapTokens: StakePage.SwapTokens
}

type Output = {
  gas: {
    approve: bigint
    deposit: bigint
  }
  isSubmitting: boolean
  isAllowanceFetching: boolean
  swapTokens: ReturnType<typeof useSwapTokens>
  submit: () => void
  onMaxButtonClick: ReturnType<typeof useMaxStake>
}

interface Hook {
  (params: Input): Output
  mock: Output
}

const useStake: Hook = ({ swapTokens, ...params }) => {
  const { field, fetch, vaultAddress } = params

  const { sdk } = useConfig()
  const actions = useActions()

  const swapToken = swapTokens.selected

  const onSwap = useCallback((buyAmount: bigint) => {
    swapTokens.setSelected('')
    field.setValue(buyAmount)
  }, [ field, swapTokens ])

  const onSuccess = useCallback(({ hash, assets }) => {
    fetch.data()

    if (assets) {
      const blockExplorerUrl = sdk.config.network.blockExplorerUrl

      actions.vault.user.allocatorActions.addFirstItem({
        hash,
        assets,
        actionType: AllocatorActionType.Deposited,
        link: blockExplorerUrl,
      })

      const tokens = [
        {
          token: sdk.config.tokens.depositToken,
          action: Action.Stake,
          value: assets,
        },
      ]

      openTxCompletedModal({ tokens, hash })
    }
  }, [ sdk, fetch ])

  const depositGas = useStakeGas()

  const { approveGas, isSubmitting, isAllowanceFetching, submit } = useStakeSubmit({
    field,
    swapToken,
    stakeStep: StakeStep.Stake,
    onSwap,
    onSuccess,
    openTransactionsFlowModal,
  })

  const onMaxButtonClick = useMaxStake({
    field,
    approveGas,
    depositGas,
    swapToken: swapTokens.selected,
  })

  return useMemo(() => ({
    gas: {
      approve: approveGas,
      deposit: depositGas,
    },
    swapTokens,
    isSubmitting,
    isAllowanceFetching,
    submit,
    onMaxButtonClick,
  }), [
    approveGas,
    depositGas,
    swapTokens,
    isSubmitting,
    isAllowanceFetching,
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
  isAllowanceFetching: false,
  swapTokens: useSwapTokens.mock,
  submit: () => Promise.resolve(undefined),
  onMaxButtonClick: () => Promise.resolve(0n),
}


export default useStake
