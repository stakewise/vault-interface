import { AbortRequest } from 'sdk'
import { ZeroAddress, formatEther } from 'ethers'
import methods from 'sw-methods'


type Input = {
  userAddress: string
  amount: bigint
  signSDK: SDK
}

type SwapData = StakePage.Unstake.BalancerSwapData

let fetchQueue: AbortRequest<SwapData> | undefined

const getExchangeCallData = async (values: Input) => {
  const { signSDK, amount, userAddress } = values

  const isToNativeToken = signSDK.config.tokens.depositToken === signSDK.config.tokens.nativeToken

  const from = signSDK.config.addresses.tokens.mintToken

  const to = isToNativeToken
    ? ZeroAddress
    : signSDK.config.addresses.tokens.depositToken

  const url = new URL('/api/balancer-quote', window.location.origin)

  url.search = new URLSearchParams({
    network: signSDK.network.toString(),
    amount: formatEther(amount),
    address: userAddress,
    from,
    to,
  }).toString()

  fetchQueue?.abort()
  fetchQueue = methods.fetch<SwapData>(url.toString())

  const { returnAmount, transactionData } = await fetchQueue

  return {
    tx: transactionData,
    receiveAssets: BigInt(returnAmount),
  }
}


export default getExchangeCallData
