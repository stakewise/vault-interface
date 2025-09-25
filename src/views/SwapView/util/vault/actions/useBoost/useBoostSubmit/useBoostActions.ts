import { useCallback, useMemo } from 'react'
import { useBalances, useSubgraphUpdate } from 'hooks'
import { BoostStep } from 'helpers/enums'
import { useConfig } from 'config'
import { getters } from 'helpers'

import Transactions from 'components/Transactions/Transactions'
import type { SetTransaction, SetNextTransactionsFailed } from 'components/Transactions/types'
import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'

import vaultHooks from '../../../index'


type Input = {
  allowance: bigint
  vaultAddress: string
  permitAddress: string | null
  field:  Forms.Field<bigint>
  approve: () => Promise<string | undefined>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
  checkAllowance: (params: { hash?: string, allowance: bigint }) => Promise<void>
}

type PermitParams = {
  vault: string
  amount: bigint
  deadline: number
  v: number
  r: string
  s: string
}

type HandleSuccessInput = {
  hash: string
  amount: bigint
  permitParams?: PermitParams
}

type ApproveOrPermitInput = {
  amount: bigint
  userAddress: string
  vaultAddress: string
  setTransaction: SetTransaction
  setNextTransactionsFailed: SetNextTransactionsFailed
}

type ApproveInput = {
  setTransaction: SetTransaction
  setNextTransactionsFailed: SetNextTransactionsFailed
}

type UpgradeInput = {
  userAddress: string
  vaultAddress: string
  setTransaction: SetTransaction
  setNextTransactionsFailed: SetNextTransactionsFailed
}

type PermitInput = {
  userAddress: string
  vaultAddress: string
  spenderAddress: string
  setTransaction: SetTransaction
  setNextTransactionsFailed: SetNextTransactionsFailed
}

type BoostInput = {
  amount: bigint
  userAddress: string
  vaultAddress: string
  permitParams?: PermitParams
  leverageStrategyData: {
    version: number
    isUpgradeRequired: boolean
  }
  setTransaction: SetTransaction
}

const useBoostActions = (values: Input) => {
  const { allowance, permitAddress, vaultAddress, field, fetchAllUserData, approve, checkAllowance } = values

  const { sdk, signSDK, address, chainId, cancelOnChange } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()

  const handleGetUserApy = useCallback(async () => {
    if (vaultAddress && address) {
      const apy = await sdk.vault.getUserApy({
        vaultAddress,
        userAddress: address,
      })

      return apy
    }

    return 0
  }, [ sdk, address, vaultAddress ])

  const refetchData = useCallback(() => {
    cancelOnChange({
      chainId,
      address,
      logic: () => {
        Promise.all([
          fetchAllUserData(),
          refetchMintTokenBalance(),
          refetchNativeTokenBalance(),
        ])
      },
    })
  }, [
    chainId,
    address,
    cancelOnChange,
    fetchAllUserData,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
  ])

  const handleApprove = useCallback(async (values: ApproveInput) => {
    const { setTransaction, setNextTransactionsFailed } = values

    try {
      const hash = await approve()

      setTransaction(BoostStep.Permit, Transactions.Status.Processing)

      await checkAllowance({ hash, allowance })

      setTransaction(BoostStep.Permit, Transactions.Status.Success)
    }
    catch (error) {
      setNextTransactionsFailed(BoostStep.Permit)

      return Promise.reject(error)
    }
  }, [ allowance, approve, checkAllowance ])

  const permit = useCallback(async (values: PermitInput) => {
    const { userAddress, vaultAddress, spenderAddress, setTransaction, setNextTransactionsFailed } = values

    try {
      setTransaction(BoostStep.Permit, Transactions.Status.Confirm)

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
      setNextTransactionsFailed(BoostStep.Permit)

      return Promise.reject(error)
    }
  }, [ signSDK ])

  const boost = useCallback(async (values: BoostInput) => {
    const { amount, userAddress, vaultAddress, permitParams, leverageStrategyData, setTransaction } = values

    try {
      setTransaction(BoostStep.Boost, Transactions.Status.Confirm)

      const referrerAddress = getters.getReferrer()

      const hash = await signSDK.boost.lock({
        amount,
        userAddress,
        vaultAddress,
        referrerAddress,
        permitParams,
        leverageStrategyData,
      })

      setTransaction(BoostStep.Boost, Transactions.Status.Processing)

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

  const approveOrPermit = useCallback(async (values: ApproveOrPermitInput) => {
    const { amount, userAddress, vaultAddress, setTransaction, setNextTransactionsFailed } = values

    const isPermitRequired = amount > allowance

    let permitParams

    if (permitAddress && isPermitRequired) {
      const code = await signSDK.provider.getCode(userAddress)
      const isMultiSig = code !== '0x'

      if (isMultiSig) {
        await handleApprove({
          setTransaction,
          setNextTransactionsFailed,
        })
      }
      else {
        permitParams = await permit({
          spenderAddress: permitAddress,
          userAddress,
          vaultAddress,
          setTransaction,
          setNextTransactionsFailed,
        })
      }
    }

    return permitParams
  }, [ permitAddress, allowance, signSDK, permit, handleApprove ])

  const onSuccess = useCallback(async (values: HandleSuccessInput) => {
    const { hash, amount, permitParams } = values

    field.reset()

    if (permitParams) {
      checkAllowance({ allowance: 0n })
    }

    const userAPY = await handleGetUserApy()

    const tokens = [
      {
        apy: userAPY,
        value: amount,
        action: Action.Boost,
        token: signSDK.config.tokens.mintToken,
      },
    ]

    openTxCompletedModal({ hash, tokens })
  }, [ field, checkAllowance, signSDK, handleGetUserApy ])

  const upgrade = useCallback(async (values: UpgradeInput) => {
    const { userAddress, vaultAddress, setTransaction } = values

    try {
      setTransaction(BoostStep.Upgrade, Transactions.Status.Confirm)

      const hash = await signSDK.boost.upgradeLeverageStrategy({
        userAddress,
        vaultAddress,
      })

      setTransaction(BoostStep.Upgrade, Transactions.Status.Processing)

      await subgraphUpdate({ hash })

      setTransaction(BoostStep.Upgrade, Transactions.Status.Success)

      return hash
    }
    catch (error) {
      setTransaction(BoostStep.Upgrade, Transactions.Status.Fail)
      setTransaction(BoostStep.Permit, Transactions.Status.Fail)
      setTransaction(BoostStep.Boost, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [
    signSDK,
    subgraphUpdate,
  ])

  return useMemo(() => ({
    boost,
    upgrade,
    onSuccess,
    refetchData,
    approveOrPermit,
  }), [
    boost,
    upgrade,
    onSuccess,
    refetchData,
    approveOrPermit,
  ])
}


export default useBoostActions
