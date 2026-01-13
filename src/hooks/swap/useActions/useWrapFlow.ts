import { useCallback, useMemo } from 'react'
import { Network } from 'sdk'
import { useConfig } from 'config'
import { StakeStep } from 'helpers/enums'
import { createContracts } from 'helpers/contracts'
import type { TradeParameters } from '@cowprotocol/cow-sdk'
import { swapTokens as swapTokenAddresses } from 'helpers'

import { SetTransaction, Transactions } from 'components'

import useActions from '../../data/useActions'
import waitForTransaction from '../../fetch/util/waitForTransaction'


type Input = {
  step: StakeStep.Swap
}

type SendOrderInput = {
  quoteRequest: TradeParameters
  setTransaction: SetTransaction
}

const useWrapFlow = (values: Input) => {
  const { step } = values

  const { signSDK, isEthereum } = useConfig()
  const actions = useActions()

  const wrappedTokenAddress = isEthereum
    ? swapTokenAddresses[Network.Mainnet].WETH
    : swapTokenAddresses[Network.Gnosis].wxDAI

  const sendOrder = useCallback(async (values: SendOrderInput) => {
    const { quoteRequest, setTransaction } = values

    const { owner, amount } = quoteRequest

    const isWithdraw = quoteRequest.sellToken === wrappedTokenAddress

    const signer = await signSDK.provider.getSigner(owner)
    const contract = createContracts(signSDK).helpers.createWrappedToken(wrappedTokenAddress).connect(signer)

    const estimatedGas = isWithdraw
      ? await contract.withdraw.estimateGas(amount)
      : await contract.deposit.estimateGas({ value: amount })

    const gasLimit = estimatedGas / 100n * 120n

    const { hash } = isWithdraw
      ? await contract.withdraw(amount, { gasLimit })
      : await contract.deposit({ value: amount, gasLimit })

    setTransaction(step, Transactions.Status.Processing)

    const isSuccess = await waitForTransaction({
      hash,
      provider: signSDK.provider,
    })

    if (!isSuccess) {
      return Promise.reject('Create order transaction failed')
    }

    actions.ui.setBottomLoaderTransaction(`${signSDK.config.network.blockExplorerUrl}/tx/${hash}`)

    setTransaction(step, Transactions.Status.Success)

    return {
      buyAmount: BigInt(amount),
      hash,
    }
  }, [ step, actions, signSDK, wrappedTokenAddress ])

  return useMemo(() => ({
    sendOrder,
  }), [
    sendOrder,
  ])
}


export default useWrapFlow
