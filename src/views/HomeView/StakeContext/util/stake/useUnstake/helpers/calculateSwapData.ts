import { constants } from 'helpers'
import methods from 'sw-methods'

import getDefaultCallData from './getDefaultCallData'
import getExchangeCallData from './getExchangeCallData'


type Input = {
  signSDK: SDK
  amount: bigint
  userAddress: string
  vaultAddress: string
}

type Output = {
  exchangeRate: bigint
  swapData: StakePage.Unstake.SwapData[]
}

const calculateSwapData = async (values: Input): Promise<Output> => {
  const { amount, signSDK, userAddress, vaultAddress } = values

  const vaultData = await getDefaultCallData({
    vaultAddress,
    userAddress,
    signSDK,
    amount,
  })

  const exchangeAmount = amount - vaultData.burnAmount
  const isExchange = exchangeAmount > constants.blockchain.minimalAmount
  const isVaultAction = vaultData.burnAmount > constants.blockchain.minimalAmount

  if (!isVaultAction) {
    const { tx, receiveAssets } = await getExchangeCallData({ amount, signSDK, userAddress })

    const exchangeRate = receiveAssets * constants.blockchain.amount1 / amount

    return {
      exchangeRate,
      swapData: [
        {
          amountShares: amount,
          isExchange: true,
          receiveAssets,
          tx,
        },
      ],
    }
  }
  else if (isExchange) {
    const exchange = await getExchangeCallData({
      amount: exchangeAmount,
      userAddress,
      signSDK,
    })

    const receiveAssets = vaultData.receiveAssets + exchange.receiveAssets
    const exchangeRate = receiveAssets * constants.blockchain.amount1 / amount

    return {
      exchangeRate,
      swapData: [
        // ATTN balancer swap should be a first (if the exchange rate changes, the transaction fails)
        {
          receiveAssets: exchange.receiveAssets,
          amountShares: exchangeAmount,
          isExchange: true,
          tx: exchange.tx,
        },
        {
          receiveAssets: vaultData.receiveAssets,
          amountShares: vaultData.burnAmount,
          isVaultAction: true,
          tx: vaultData.tx,
        },
      ],
    }
  }

  const exchangeRate = vaultData.receiveAssets * constants.blockchain.amount1 / amount

  return {
    exchangeRate,
    swapData: [
      {
        receiveAssets: vaultData.receiveAssets,
        amountShares: amount,
        isVaultAction: true,
        tx: vaultData.tx,
      },
    ],
  }
}


export default calculateSwapData
