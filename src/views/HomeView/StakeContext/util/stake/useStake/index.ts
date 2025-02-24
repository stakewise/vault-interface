import { useState, useCallback, useMemo, useRef } from 'react'
import { useBalances, useActions, useSubgraphUpdate, useStore, useApprove } from 'hooks'
import { commonMessages, constants, requests } from 'helpers'
import notifications from 'sw-modules/notifications'
import { StakeStep } from 'helpers/enums'
import { useConfig } from 'config'
import { getGas } from 'sdk'

import { Action, openTxCompletedModal } from 'layouts/modals'
import { Transactions } from 'components'

import emptyBalance from '../../emptyBalance'
import useApproveRequired from '../useApproveRequired'
import { getGnosisCallData, getDefaultCallData } from './helpers'


type Input = Pick<StakePage.Context, 'field' | 'vaultAddress' | 'unstakeQueue' | 'data'>

type HandleStakeInput = StakePage.Stake.SubmitInput & {
  amount: bigint
  userAddress: string
}

export const mockStake: StakePage.Stake.Actions = {
  isSubmitting: false,
  isApproveRequired: true,
  submit: () => Promise.resolve(),
  getMaxStake: () => Promise.resolve(0n),
  getTransactionGas: () => Promise.resolve(0n),
  calculateSwap: ()  => Promise.resolve({
    receiveShares: 0n,
    exchangeRate: 0n,
  }),
}

const storeSelector = (store: Store) => ({
  depositTokenBalance : store.account.balances.data.depositTokenBalance,
})

const useStake = (values: Input) => {
  const { vaultAddress, data, field } = values

  const actions = useActions()
  const { depositTokenBalance } = useStore(storeSelector)
  const [ isSubmitting, setSubmitting ] = useState(false)
  const { sdk, signSDK, chainId, address, activeWallet, isGnosis, cancelOnChange } = useConfig()

  const { allowance, approve, checkAllowance } = useApprove({
    tokenAddress: signSDK.config.addresses.tokens.depositToken,
    recipient: vaultAddress,
    skip: !isGnosis,
  })

  const isApproveRequired = useApproveRequired({
    amountField: field,
    skip: !isGnosis,
    allowance,
  })

  const isGnosisSafeWallet = activeWallet === constants.walletNames.gnosisSafe

  const gasRef = useRef(0n)
  const timerRef = useRef<number>(0)

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()

  const getTransactionGas = useCallback(async () => {
    const currentTime = new Date().getTime()
    const timeDiff = timerRef.current - currentTime
    const isValidCacheTime = timeDiff > 0 && timeDiff < 1000 * 60 * 3

    if (gasRef.current && isValidCacheTime) {
      return gasRef.current
    }

    const isValidBalance = depositTokenBalance > constants.blockchain.gwei

    try {
      if (!address || !isValidBalance) {
        return 0n
      }

      const userAddress = address as string
      const amount = depositTokenBalance / 2n // try to check half of balance to get gas
      const params = { vaultAddress, userAddress, signSDK, amount }

      const { tx } = isGnosis
        ? await getGnosisCallData(params)
        : await getDefaultCallData(params)

      const signer = await signSDK.provider.getSigner(userAddress)
      const estimatedGas = await signer.estimateGas(tx)

      const gas = await getGas({ estimatedGas, provider: signSDK.provider })

      gasRef.current = gas
      timerRef.current = currentTime

      return gas
    }
    catch {
      return 0n
    }
  }, [
    address,
    signSDK,
    isGnosis,
    vaultAddress,
    depositTokenBalance,
  ])

  const getMaxStake = useCallback(async () => {
    if (!address) {
      return emptyBalance
    }

    if (isGnosis || isGnosisSafeWallet) {
      return depositTokenBalance
    }

    const gas = await getTransactionGas()
    const result = depositTokenBalance - (gas * 2n)

    return result > 0n ? result : 0n
  }, [ address, depositTokenBalance, isGnosis, isGnosisSafeWallet, getTransactionGas ])

  const handleApprove = useCallback(async (values: StakePage.Stake.SubmitInput) => {
    const { setTransaction } = values

    try {
      const hash = await approve()

      setTransaction(StakeStep.Approve, Transactions.Status.Waiting)

      await checkAllowance({ hash, allowance })

      setTransaction(StakeStep.Approve, Transactions.Status.Success)
    }
    catch (error) {
      setTransaction(StakeStep.Approve, Transactions.Status.Fail)
      setTransaction(StakeStep.Stake, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [ allowance, approve, checkAllowance ])

  const handleStake = useCallback(async (values: HandleStakeInput) => {
    const { amount, userAddress, setTransaction } = values

    const params = { vaultAddress, userAddress, signSDK, amount }

    setTransaction(StakeStep.Stake, Transactions.Status.Confirm)

    try {
      const { tx, receiveShares } = isGnosis
        ? await getGnosisCallData(params)
        : await getDefaultCallData(params)

      const signer = await signSDK.provider.getSigner(userAddress)
      const { hash } = await signer.sendTransaction(tx)

      setTransaction(StakeStep.Stake, Transactions.Status.Waiting)

      if (hash) {
        await subgraphUpdate({ hash })
        setTransaction(StakeStep.Stake, Transactions.Status.Success)

        return {
          hash,
          receiveShares,
        }
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
  }, [ vaultAddress, isGnosis, signSDK, subgraphUpdate ])

  const submit = useCallback(async (values?: StakePage.Stake.SubmitInput) => {
    const { setTransaction = () => {} } = values || {}

    try {
      const amount = field.value
      const userAddress = address

      if (!amount || !userAddress) {
        return
      }

      setSubmitting(true)

      if (isApproveRequired) {
        await handleApprove({ setTransaction })
      }

      const { hash, receiveShares } = await handleStake({
        amount,
        userAddress,
        setTransaction,
      })

      field.reset()

      await cancelOnChange({
        chainId,
        address,
        logic: () => Promise.all([
          data.refetchData(),
          refetchMintTokenBalance(),
          refetchDepositTokenBalance(),
        ]),
      })

      const tokens = [
        {
          token: signSDK.config.tokens.mintToken,
          value: receiveShares,
          action: Action.Mint,
        },
      ]

      openTxCompletedModal({ tokens, hash })
    }
    catch (error) {
      actions.ui.resetBottomLoader()
      console.error('Stake: submit failed', error as Error)

      notifications.open({
        text: commonMessages.notification.failed,
        type: 'error',
      })
    }
    finally {
      setSubmitting(false)
    }
  }, [
    data,
    field,
    chainId,
    actions,
    signSDK,
    address,
    isApproveRequired,
    handleStake,
    handleApprove,
    cancelOnChange,
    refetchMintTokenBalance,
    refetchDepositTokenBalance,
  ])

  const calculateSwap = useCallback(async (amount: bigint) => {
    if (!amount) {
      return {
        receiveShares: 0n,
        exchangeRate: 0n,
      }
    }

    const data = await requests.fetchStakeSwapData({
      userAddress: address,
      vaultAddress,
      amount,
      sdk,
    })

    return data
  }, [ address, vaultAddress, sdk ])

  return useMemo(() => ({
    isSubmitting,
    isApproveRequired,
    submit,
    getMaxStake,
    calculateSwap,
    getTransactionGas,
  }), [
    isSubmitting,
    isApproveRequired,
    submit,
    getMaxStake,
    calculateSwap,
    getTransactionGas,
  ])
}


export default useStake
