import { useCallback, useMemo, useState } from 'react'
import notifications from 'sw-modules/notifications'
import { useConfig } from 'config'
import { BoostStep } from 'helpers/enums'
import { commonMessages, getters } from 'helpers'

import { Transactions, SetTransaction } from 'components'
import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'

import useActions from '../data/useActions'
import useBoostAllowance from './useBoostAllowance'
import useSubgraphUpdate from '../fetch/useSubgraphUpdate'


type ApproveInput = {
  setTransaction: SetTransaction
}

type PermitInput = {
  userAddress: string
  vaultAddress: string
  spenderAddress: string
  setTransaction: SetTransaction
}

type BoostInput = {
  amount: bigint
  userAddress: string
  vaultAddress: string
  permitParams?: {
    vault: string
    amount: bigint
    deadline: number
    v: number
    r: string
    s: string
  }
  setTransaction: SetTransaction
}

type SubmitInput = {
  amount: bigint
  permitAddress?: string
  getUserApy?: () => Promise<number>
  onSuccess?: (hash: string) => Promise<void>
  setTransaction?: SetTransaction
}

type Output = {
  allowance: bigint
  isSubmitting: boolean
  isAllowanceFetching: boolean
  submit: (values: SubmitInput) => Promise<string | undefined>
}

const useBoostSubmit = (vaultAddress: string | null): Output => {
  const actions = useActions()
  const { signSDK, address } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const {
    allowance,
    permitAddress,
    isFetching,
    approve,
    checkAllowance,
  } = useBoostAllowance(vaultAddress)

  const handleApprove = useCallback(async (values: ApproveInput) => {
    const { setTransaction } = values

    try {
      const hash = await approve()

      setTransaction(BoostStep.Permit, Transactions.Status.Waiting)

      await checkAllowance({ hash, allowance })

      setTransaction(BoostStep.Permit, Transactions.Status.Success)
    }
    catch (error) {
      setTransaction(BoostStep.Permit, Transactions.Status.Fail)
      setTransaction(BoostStep.Boost, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [ allowance, approve, checkAllowance ])

  const permit = useCallback(async (values: PermitInput) => {
    const { userAddress, vaultAddress, spenderAddress, setTransaction } = values

    try {
      const { amount, deadline, v, r, s } = await signSDK.utils.getPermitSignature({
        contract: signSDK.contracts.tokens.mintToken,
        ownerAddress: userAddress,
        spenderAddress,
      })

      setTransaction(BoostStep.Permit, Transactions.Status.Success)

      return {
        amount,
        deadline,
        vault: vaultAddress,
        v,
        r,
        s,
      }
    }
    catch (error) {
      setTransaction(BoostStep.Permit, Transactions.Status.Fail)
      setTransaction(BoostStep.Boost, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [ signSDK ])

  const boost = useCallback(async (values: BoostInput) => {
    const { amount, userAddress, vaultAddress, permitParams, setTransaction } = values

    try {
      setTransaction(BoostStep.Boost, Transactions.Status.Confirm)

      const referrerAddress = getters.getReferrer()

      const hash = await signSDK.boost.lock({
        amount,
        userAddress,
        vaultAddress,
        referrerAddress,
        permitParams,
      })

      setTransaction(BoostStep.Boost, Transactions.Status.Waiting)

      await subgraphUpdate({ hash })

      setTransaction(BoostStep.Boost, Transactions.Status.Success)

      return hash
    }
    catch (error) {
      setTransaction(BoostStep.Boost, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [
    signSDK,
    subgraphUpdate,
  ])

  const submit = useCallback(async (values: SubmitInput) => {
    const { amount, getUserApy, setTransaction = () => {}, onSuccess } = values

    try {
      if (!amount || !address || !vaultAddress) {
        return
      }

      actions.ui.setBottomLoader({
        content: commonMessages.notification.waitingConfirmation,
      })

      console.log({
        category: 'action',
        message: 'Boost submit click',
      })

      setSubmitting(true)

      let permitParams

      const isPermitRequired = amount > allowance

      if (permitAddress && isPermitRequired) {
        const code = await signSDK.provider.getCode(address)
        const isMultiSig = code !== '0x'

        if (isMultiSig) {
          await handleApprove({
            setTransaction,
          })
        }
        else {
          permitParams = await permit({
            spenderAddress: permitAddress,
            userAddress: address,
            vaultAddress,
            setTransaction,
          })
        }
      }

      const hash = await boost({
        amount,
        permitParams,
        vaultAddress,
        userAddress: address,
        setTransaction,
      })

      if (typeof onSuccess === 'function') {
        await onSuccess(hash)
      }

      if (permitParams) {
        checkAllowance({ allowance: 0n })
      }

      const userAPY = await getUserApy?.() || 0

      const tokens = [
        {
          apy: userAPY,
          value: amount,
          action: Action.Boost,
          token: signSDK.config.tokens.mintToken,
        },
      ]

      openTxCompletedModal({ hash, tokens })
    }
    catch (error) {
      actions.ui.resetBottomLoader()
      console.error('Boost send transaction error', error as Error)

      notifications.open({
        text: commonMessages.notification.failed,
        type: 'error',
      })

      return Promise.reject(error)
    }
    finally {
      setSubmitting(false)
    }
  }, [
    signSDK,
    address,
    actions,
    allowance,
    vaultAddress,
    permitAddress,
    boost,
    permit,
    handleApprove,
    checkAllowance,
  ])

  return useMemo(() => ({
    allowance,
    isSubmitting,
    isAllowanceFetching: isFetching,
    submit,
  }), [
    allowance,
    isFetching,
    isSubmitting,
    submit,
  ])
}


export default useBoostSubmit
