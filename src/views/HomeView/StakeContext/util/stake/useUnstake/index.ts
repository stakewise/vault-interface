import { useCallback, useMemo, useRef } from 'react'
import { useBalances, useActions, useTransaction, useSubgraphUpdate, useObjectState, useApprove } from 'hooks'
import notifications from 'sw-modules/notifications'
import { commonMessages } from 'helpers'
import { UnstakeStep } from 'helpers/enums'
import { addresses } from 'contracts'
import { useConfig } from 'config'
import { getGas } from 'sdk'

import { Transactions } from 'components'
import { Action, TokenData, FailData, openTxCompletedModal, openTransactionsFlowModal } from 'layouts/modals'

import { calculateSwapData, useData } from './helpers'

import useApproveRequired from '../useApproveRequired'


type Input = Pick<StakePage.Context, 'field' | 'vaultAddress' | 'unstakeQueue' | 'data'>

type HandleUnstakeInput = StakePage.Unstake.SubmitInput & {
  amount: bigint
  userAddress: string
  isApproveFailed: boolean
}

type UnstakeStepOutput = {
  value: bigint
  hash?: string
  error?: unknown
}

type HandleUnstakeOutput = Record<UnstakeStep, UnstakeStepOutput>

export const mockUnstake = {
  txData: {
    gas: 0n,
    rate: 0n,
    vaultAssets: 0n,
    exchangeAssets: 0n,
    isFetching: false,
  },
  refetchAllowance: 0,
  isFetching: true,
  isSubmitting: false,
  getMaxStake: () => 0n,
  submit: () => Promise.resolve(),
  getTransactionGas: () => Promise.resolve(0n),
  calculateSwap: ()  => Promise.resolve({
    exchangeRate: 0n,
    swapData: [],
  }),
}

const useUnstake = (values: Input) => {
  const { vaultAddress, field, data, unstakeQueue } = values

  const actions = useActions()
  const { signSDK, chainId, address, isGnosis, cancelOnChange } = useConfig()

  const [ state, setState ] = useObjectState({
    refetchAllowance: 0,
    isSubmitting: false,
  })

  const subgraphUpdate = useSubgraphUpdate()
  const handleTransaction = useTransaction()
  const { refetchDepositTokenBalance, refetchMintTokenBalance } = useBalances()

  const getTransactionGas = useCallback(async () => {
    try {
      if (!address || !field.value) {
        return 0n
      }

      const amount = field.value
      const userAddress = address

      const signer = await signSDK.provider.getSigner(userAddress)

      const { swapData } = await calculateSwapData({
        vaultAddress,
        userAddress,
        signSDK,
        amount,
      })

      let gas = 0n,
          needApprove = false

      const exchange = swapData.find(({ isExchange }) => isExchange)

      if (exchange) {
        const recipient = addresses[signSDK.network].balancer.vault
        const tokenAddress = signSDK.config.addresses.tokens.mintToken

        const tokenContract = signSDK.contracts.helpers.createErc20(tokenAddress)
        const allowanceAmount = await tokenContract.allowance(address, recipient)

        needApprove = allowanceAmount < exchange.amountShares

        if (needApprove) {
          const signer = await signSDK.provider.getSigner()
          const signedContract = tokenContract.connect(signer)
          const estimatedGas = await signedContract.approve.estimateGas(recipient, exchange.amountShares)
          const approveTxGas = await getGas({ estimatedGas, provider: signSDK.provider })
          // We mock it since we can't calculate gas for exchange without approval
          const exchangeTxGas = approveTxGas * 2n

          gas += approveTxGas + exchangeTxGas
        }
      }

      for (let i = 0; i < swapData.length; i++) {
        const { tx, isExchange } = swapData[i]

        const skip = isExchange && needApprove

        if (!skip) {
          const estimatedGas = await signer.estimateGas(tx)

          gas += await getGas({ estimatedGas, provider: signSDK.provider })
        }
      }

      return gas
    }
    catch (error) {
      return 0n
    }
  }, [
    field,
    address,
    signSDK,
    vaultAddress,
  ])

  const getMaxStake = useCallback(() => data.mintTokenBalance, [ data ])

  const handleUnstake = useCallback(async (values: HandleUnstakeInput): Promise<HandleUnstakeOutput> => {
    const { amount, userAddress, isApproveFailed, setTransaction } = values

    const signer = await signSDK.provider.getSigner(userAddress)

    const { swapData } = await calculateSwapData({
      vaultAddress,
      userAddress,
      signSDK,
      amount,
    })

    const result = {} as HandleUnstakeOutput

    for (let i = 0; i < swapData.length; i++) {
      const { tx, amountShares, receiveAssets, isExchange, isVaultAction } = swapData[i]

      const step = isVaultAction ? UnstakeStep.Queue : UnstakeStep.Swap

      result[step] = {
        value: isExchange ? receiveAssets : amountShares,
      }

      try {
        setTransaction(step, Transactions.Status.Confirm)

        const { hash } = await signer.sendTransaction(tx)

        result[step].hash = hash

        setTransaction(step, Transactions.Status.Waiting)

        if (isExchange) {
          if (isApproveFailed) {
            throw new Error('Approve failed')
          }

          await handleTransaction(hash)
        }

        if (isVaultAction) {
          await subgraphUpdate({ hash })
        }

        setTransaction(step, Transactions.Status.Success)
      }
      catch (error) {
        setTransaction(step, Transactions.Status.Fail)

        result[step].error = error
      }
    }

    return result
  }, [ signSDK, vaultAddress, subgraphUpdate, handleTransaction ])

  const calculateSwap = useCallback<StakePage.Unstake.Actions['calculateSwap']>(async (amount: bigint) => {
    if (!address || !amount) {
      return {
        exchangeRate: 0n,
        swapData: [],
      }
    }

    const data = await calculateSwapData({
      userAddress: address,
      vaultAddress,
      signSDK,
      amount,
    })

    return data
  }, [ address, vaultAddress, signSDK ])

  const txData = useData({
    field,
    calculateSwap,
    getTransactionGas,
  })

  const isExchange = Boolean(txData.exchangeAssets)
  const isMixedTx = Boolean(txData.vaultAssets && txData.exchangeAssets)
  const skip = !isGnosis && !isExchange && !isMixedTx

  const { allowance, isFetching: isApproveDataFetching, approve, checkAllowance } = useApprove({
    recipient: addresses[signSDK.network].balancer.vault,
    tokenAddress: signSDK.config.addresses.tokens.mintToken,
    skip,
  })

  const isApproveRequired = useApproveRequired({
    amountField: field,
    allowance,
    skip,
  })

  const handleApprove = useCallback(async (values: StakePage.Unstake.SubmitInput) => {
    const { setTransaction } = values

    try {
      const hash = await approve()

      setTransaction(UnstakeStep.Approve, Transactions.Status.Waiting)

      await checkAllowance({ hash, allowance })

      setTransaction(UnstakeStep.Approve, Transactions.Status.Success)

      return true
    }
    catch (error) {
      setTransaction(UnstakeStep.Approve, Transactions.Status.Fail)
      setTransaction(UnstakeStep.Swap, Transactions.Status.Fail)

      return false
    }
  }, [ allowance, approve, checkAllowance ])

  const startUnstakeFlowRef = useRef(() => {})

  const submit = useCallback(async (values?: StakePage.Unstake.SubmitInput) => {
    const { setTransaction = () => {} } = values || {}

    try {
      const amount = field.value
      const userAddress = address

      if (!amount || !userAddress) {
        return
      }

      setState({ isSubmitting: true })

      let isApproved = !isApproveRequired

      if (isApproveRequired) {
        isApproved = await handleApprove({ setTransaction })
      }

      const unstakeSteps = await handleUnstake({
        amount,
        userAddress,
        isApproveFailed: isApproveRequired && !isApproved,
        setTransaction,
      })

      refetchDepositTokenBalance()

      await cancelOnChange({
        address,
        chainId,
        logic: () => Promise.all([
          data.refetchData(),
          refetchMintTokenBalance(),
          unstakeQueue.refetchData(),
        ]),
      })

      const tokens: TokenData[] = []
      const fails: FailData[] = []

      Object.keys(unstakeSteps).forEach((unstakeStep) => {
        const unstakeStepData = unstakeSteps[unstakeStep as keyof typeof unstakeSteps]

        const { hash } = unstakeStepData

        const value = unstakeStepData.value
        let token: Tokens = signSDK.config.tokens.depositToken
        let action: Action = Action.Receive

        if (unstakeStep === UnstakeStep.Queue) {
          token = signSDK.config.tokens.mintToken
          action = Action.ExitQueue
        }

        if (hash) {
          tokens.push({
            token,
            action,
            value,
            hash,
          })
        }
        else {
          fails.push({
            token,
            action,
            value,
            onTryAgainClick: startUnstakeFlowRef.current,
          })
        }
      })

      if (!fails.length) {
        field.reset()
      }

      if (!tokens.length) {
        throw new Error('All transactions failed')
      }

      openTxCompletedModal({ tokens, fails })
    }
    catch (error) {
      actions.ui.resetBottomLoader()

      notifications.open({
        text: commonMessages.notification.failed,
        type: 'error',
      })

      return Promise.reject(error)
    }
    finally {
      setState((state) => ({
        isSubmitting: false,
        refetchAllowance: state.refetchAllowance + 1,
      }))
    }
  }, [
    data,
    field,
    actions,
    chainId,
    signSDK,
    address,
    unstakeQueue,
    isApproveRequired,
    setState,
    handleApprove,
    handleUnstake,
    cancelOnChange,
    refetchMintTokenBalance,
    refetchDepositTokenBalance,
  ])

  const startUnstakeFlow = useCallback(() => {
    const isMixedTx = Boolean(txData.vaultAssets && txData.exchangeAssets)

    if (isMixedTx || isApproveRequired) {
      const availableSteps = []

      if (isApproveRequired) {
        availableSteps.push(UnstakeStep.Approve)
      }
      if (txData.exchangeAssets) {
        availableSteps.push(UnstakeStep.Swap)
      }
      if (txData.vaultAssets) {
        availableSteps.push(UnstakeStep.Queue)
      }

      openTransactionsFlowModal({
        flow: 'unstake',
        availableSteps,
        onStart: ({ setTransaction }) => submit({ setTransaction }),
      })
    }
    else {
      submit()
    }
  }, [ txData, isApproveRequired, submit ])

  startUnstakeFlowRef.current = startUnstakeFlow

  const isFetching = isApproveDataFetching || txData.isFetching

  return useMemo(() => ({
    ...state,
    txData,
    isFetching,
    submit: startUnstakeFlow,
    getMaxStake,
    calculateSwap,
    getTransactionGas,
  }), [
    state,
    txData,
    isFetching,
    getMaxStake,
    calculateSwap,
    getTransactionGas,
    startUnstakeFlow,
  ])
}


export default useUnstake
