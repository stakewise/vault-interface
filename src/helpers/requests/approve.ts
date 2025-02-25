import { MaxUint256, parseEther } from 'ethers'
import methods from 'sw-methods'


type Input = {
  signSDK: SDK
  to: string
  from: string
  amount?: string
  tokenAddress: string
}

const approve = async (values: Input) => {
  const { from, to, amount, tokenAddress, signSDK } = values

  const tokenContract = signSDK.contracts.helpers.createErc20(tokenAddress)
  const signer = await signSDK.provider.getSigner(from)
  const signedContract = tokenContract.connect(signer)
  const value = amount ? parseEther(amount) : MaxUint256

  const [ gasCost, feeData ] = await Promise.all([
    signedContract.approve.estimateGas(to, value),
    signSDK.provider.getFeeData(),
  ])

  const { maxFeePerGas, maxPriorityFeePerGas } = feeData

  const gasLimit = methods.getGasMargin(gasCost)
  const overrides: Parameters<typeof signedContract.approve>[2] = {
    gasLimit,
  }

  if (maxFeePerGas) {
    overrides.maxFeePerGas = maxFeePerGas
  }

  if (maxPriorityFeePerGas) {
    overrides.maxPriorityFeePerGas = maxPriorityFeePerGas.toString()
  }

  return signedContract.approve(to, value, overrides)
}


export default approve
