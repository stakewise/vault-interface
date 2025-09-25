import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { UnboostStep } from 'helpers/enums'
import notifications from 'modules/notifications'
import { commonMessages, modifiers } from 'helpers'
import { useStore, useActions, useBalances, useSubgraphUpdate } from 'hooks'

import { Transactions } from 'components'
import type { StepsData, SetNextTransactionsFailed, SetTransaction } from 'components'
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
  setNextTransactionsFailed: SetNextTransactionsFailed
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
  setNextTransactionsFailed?: SetNextTransactionsFailed
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
    const { userAddress, vaultAddress, setTransaction, setNextTransactionsFailed } = values

    try {
      setTransaction(UnboostStep.Upgrade, Transactions.Status.Confirm)

      const hash = await signSDK.boost.upgradeLeverageStrategy({
        userAddress,
        vaultAddress,
      })

      setTransaction(UnboostStep.Upgrade, Transactions.Status.Processing)

      await subgraphUpdate({ hash })

      setTransaction(UnboostStep.Upgrade, Transactions.Status.Success)

      return hash
    }
    catch (error) {
      setNextTransactionsFailed(UnboostStep.Upgrade)

      return Promise.reject(error)
    }
  }, [
    signSDK,
    subgraphUpdate,
  ])

  const unboost = useCallback(async (values: UnboostInput) => {
    const { percent, userAddress, vaultAddress, leverageStrategyData, setTransaction } = values

    try {
      setTransaction(UnboostStep.Unboost, Transactions.Status.Confirm)

      const hash = await signSDK.boost.unlock({
        percent,
        userAddress,
        vaultAddress,
        leverageStrategyData,
      })

      setTransaction(UnboostStep.Unboost, Transactions.Status.Processing)

      await subgraphUpdate({ hash })

      setTransaction(UnboostStep.Unboost, Transactions.Status.Success)

      return hash
    }
    catch (error) {
      setTransaction(UnboostStep.Unboost, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [
    signSDK,
    subgraphUpdate,
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
        action: Action.Exiting,
      })
    }

    openTxCompletedModal({ tokens, hash })
  }, [ percentField, boostedShares, boostedRewardAssets, signSDK ])

  const onStart = useCallback(async (values: OnStartInput) => {
    const { percent, setTransaction = () => {}, setNextTransactionsFailed = () => {} } = values

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
            setNextTransactionsFailed,
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
        onStart: ({ setTransaction, setNextTransactionsFailed }) => {
          return onStart({ percent, setTransaction, setNextTransactionsFailed })
        },
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
