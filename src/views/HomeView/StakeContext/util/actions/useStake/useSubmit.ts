import { useCallback, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { StakeStep } from 'helpers/enums'
import notifications from 'sw-modules/notifications'
import { commonMessages, getters } from 'helpers'
import { useActions, useBalances, useSubgraphUpdate } from 'hooks'

import { Action, openTxCompletedModal } from 'layouts/modals'
import { SetTransaction, Transactions } from 'components'

import useDepositTokenApprove from './useDepositTokenApprove'


type ApproveInput = {
  assets: bigint
  depositToken: ReturnType<typeof useDepositTokenApprove>
  setTransaction: SetTransaction
}

type SubmitInput = {
  assets: bigint
  userAddress: string
  setTransaction: SetTransaction
}

type Input = Partial<ApproveInput> & {
  assets: bigint
}

const useSubmit = (params: StakePage.Params) => {
  const actions = useActions()
  const { vaultAddress } = params
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance } = useBalances()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const handleApprove = useCallback(async (values: ApproveInput) => {
    const { assets, depositToken: { approve, checkAllowance, allowance }, setTransaction } = values

    try {
      const hash = await approve(assets)

      setTransaction(StakeStep.Approve, Transactions.Status.Waiting)

      await checkAllowance({ hash, allowance })

      setTransaction(StakeStep.Approve, Transactions.Status.Success)
    }
    catch (error) {
      setTransaction(StakeStep.Approve, Transactions.Status.Fail)
      setTransaction(StakeStep.Stake, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [])

  const handleSubmit = useCallback(async (values: SubmitInput) => {
    const { assets, userAddress, setTransaction } = values

    try {
      const referrerAddress = getters.getReferrer()

      const hash = await signSDK.vault.deposit({
        assets,
        userAddress,
        vaultAddress,
        referrerAddress,
      })

      if (hash) {
        await subgraphUpdate({ hash })

        setTransaction(StakeStep.Stake, Transactions.Status.Success)

        return hash
      }
      else {
        setTransaction(StakeStep.Stake, Transactions.Status.Fail)

        return Promise.reject('TxHash is not defined')
      }
    }
    catch (error) {
      setTransaction(StakeStep.Stake, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [ signSDK, vaultAddress, subgraphUpdate ])

  const submit = useCallback(async (values: Input) => {
    const { assets, depositToken, setTransaction = () => {} } = values

    if (!address) {
      return
    }

    setSubmitting(true)

    if (typeof depositToken !== 'undefined') {
      await handleApprove({
        assets,
        depositToken,
        setTransaction,
      })
    }

    actions.ui.setBottomLoader({
      content: commonMessages.notification.waitingConfirmation,
    })

    try {
      const hash = await handleSubmit({
        assets,
        userAddress: address,
        setTransaction,
      })

      if (hash) {
        cancelOnChange({
          address,
          chainId,
          logic: () => {
            params.fetch.vault()
            params.fetch.vaultStats(30)
            params.userFetch.balances()

            refetchDepositTokenBalance()
          },
        })

        const tokens = [
          {
            token: signSDK.config.tokens.depositToken,
            action: Action.Stake,
            value: assets,
          },
        ]

        openTxCompletedModal({ tokens, hash })
      }

      setSubmitting(false)
    }
    catch (error) {
      setSubmitting(false)
      actions.ui.resetBottomLoader()
      console.error('Deposit send transaction error', error as Error)

      notifications.open({
        type: 'error',
        text: commonMessages.notification.failed,
      })

      return Promise.reject(error)
    }
  }, [
    params,
    chainId,
    signSDK,
    address,
    actions,
    handleSubmit,
    handleApprove,
    cancelOnChange,
    refetchDepositTokenBalance,
  ])

  return useMemo(() => ({
    submit,
    isSubmitting,
  }), [
    submit,
    isSubmitting,
  ])
}


export default useSubmit
