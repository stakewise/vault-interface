import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { UnboostStep } from 'helpers/enums'
import notifications from 'modules/notifications'
import { commonMessages, modifiers } from 'helpers'
import { useStore, useActions, useBalances, useSubgraphUpdate } from 'hooks'

import { Transactions } from 'components'
import type { StepsData, SetTransaction } from 'components'
import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'
import { openTransactionsFlowModal } from 'layouts/modals/TransactionsFlowModal/TransactionsFlowModal'

import vaultHooks from '../../index'


type TokenData = {
  token: Tokens
  value: bigint
  action: Action
}

type HandleSuccessInput = {
  hash: string
  percent: number
}

type UpgradeInput = {
  userAddress: string
  vaultAddress: string
  setTransaction: SetTransaction
}

type UnboostInput = {
  percent: number
  userAddress: string
  vaultAddress: string
  leverageStrategyData: {
    version: number
    isUpgradeRequired: boolean
  }
  setTransaction: SetTransaction
}

type OnStartInput = {
  percent: number
  setTransaction?: SetTransaction
}

type Input = {
  percentField: Forms.Field<string>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
  boostedShares: store.vault.user.balances.boost.shares,
  boostedRewardAssets: store.vault.user.balances.boost.rewardAssets,
  leverageStrategyData: store.vault.user.balances.boost.leverageStrategyData,
})

const useUnboostSubmit = (values: Input) => {
  const { percentField, fetchAllUserData } = values

  const actions = useActions()
  const { signSDK, address, chainId, cancelOnChange } = useConfig()
  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()

  const {
    vaultAddress,
    boostedShares,
    boostedRewardAssets,
    leverageStrategyData,
  } = useStore(storeSelector)

  const subgraphUpdate = useSubgraphUpdate()
  const wrapTransaction = Transactions.useAction()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const stepsData = useMemo(() => {
    const result: StepsData = []

    if (leverageStrategyData.isUpgradeRequired) {
      result.push({
        id: UnboostStep.Upgrade,
        title: commonMessages.upgradeLeverageStrategy,
      })
    }

    result.push({
      id: UnboostStep.Unboost,
      title: commonMessages.buttonTitle.unboost,
    })

    return result
  }, [ leverageStrategyData ])

  const refetchData = useCallback(() => {
    cancelOnChange({
      address,
      chainId,
      logic: () => {
        Promise.all([
          fetchAllUserData(),
          refetchMintTokenBalance(),
          refetchNativeTokenBalance(),
        ])
      },
    })
  }, [
    address,
    chainId,
    cancelOnChange,
    fetchAllUserData,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
  ])

  const upgrade = useCallback(async (values: UpgradeInput) => {
    const { userAddress, vaultAddress, setTransaction } = values

    await wrapTransaction({
      step: UnboostStep.Upgrade,
      action: () => signSDK.boost.upgradeLeverageStrategy({
        userAddress,
        vaultAddress,
      }),
      confirm: subgraphUpdate,
      setTransaction,
    })
  }, [
    signSDK,
    subgraphUpdate,
    wrapTransaction,
  ])

  const unboost = useCallback(async (values: UnboostInput) => {
    const { percent, userAddress, vaultAddress, leverageStrategyData, setTransaction } = values

    let hash

    await wrapTransaction({
      step: UnboostStep.Unboost,
      action: () => signSDK.boost.unlock({
        percent,
        userAddress,
        vaultAddress,
        leverageStrategyData,
      }),
      confirm: (values) => {
        hash = values.hash

        return subgraphUpdate(values)
      },
      setTransaction,
    })

    return hash
  }, [
    signSDK,
    subgraphUpdate,
    wrapTransaction,
  ])

  const handleSuccess = useCallback(async (values: HandleSuccessInput) => {
    const { hash, percent } = values

    percentField.reset()

    const [ exitShares ] = modifiers.splitPercent(boostedShares, percent)
    const [ exitAssets ] = modifiers.splitPercent(boostedRewardAssets, percent)

    const tokens: TokenData[] = [
      {
        token: signSDK.config.tokens.mintToken,
        value: exitShares,
        action: Action.Exiting,
      },
    ]

    if (exitAssets) {
      tokens.push({
        token: signSDK.config.tokens.depositToken,
        value: exitAssets,
        action: Action.ExitingReward,
      })
    }

    openTxCompletedModal({ tokens, hash })
  }, [ percentField, boostedShares, boostedRewardAssets, signSDK ])

  const onStart = useCallback(async (values: OnStartInput) => {
    const { percent, setTransaction = () => {} } = values

    if (!percent || !address || !vaultAddress) {
      return
    }

    try {
      actions.ui.setBottomLoader({
        content: commonMessages.notification.waitingConfirmation,
      })

      console.log({
        category: 'action',
        message: 'Submit unboost click',
      })

      setSubmitting(true)

      let hash
      let _leverageStrategyData = leverageStrategyData

      for (let i = 0; i < stepsData.length; i += 1) {
        const step = stepsData[i]

        if (step.id === UnboostStep.Upgrade) {
          await upgrade({
            userAddress: address,
            vaultAddress,
            setTransaction,
          })

          _leverageStrategyData = {
            version: 2,
            isUpgradeRequired: false,
          }
        }
        if (step.id === UnboostStep.Unboost) {
          hash = await unboost({
            percent,
            vaultAddress,
            userAddress: address,
            leverageStrategyData: _leverageStrategyData,
            setTransaction,
          })
        }
      }

      if (hash) {
        await handleSuccess({ hash, percent })
      }
    }
    catch (error) {
      actions.ui.resetBottomLoader()

      console.error('Unboost: submit failed', error as Error)

      notifications.open({
        text: commonMessages.notification.failed,
        type: 'error',
      })

      return Promise.reject(error)
    }
    finally {
      refetchData()
      setSubmitting(false)
    }
  }, [
    actions,
    address,
    stepsData,
    vaultAddress,
    leverageStrategyData,
    upgrade,
    unboost,
    refetchData,
    handleSuccess,
  ])

  const submit = useCallback(() => {
    const percent = Number(percentField.value || 0)

    if (!percent || !address || !vaultAddress) {
      return
    }

    if (stepsData.length > 1) {
      openTransactionsFlowModal({
        flow: 'unboost',
        stepsData,
        onStart: ({ setTransaction }) => onStart({ percent, setTransaction }),
      })
    }
    else {
      onStart({ percent })
    }
  }, [ address, stepsData, vaultAddress, percentField, onStart ])

  return useMemo(() => ({
    submit,
    isSubmitting,
  }), [
    submit,
    isSubmitting,
  ])
}


export default useUnboostSubmit
