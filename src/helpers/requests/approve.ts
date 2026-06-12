import { BrowserProvider, MaxUint256 } from 'ethers'
import { createErc20Contract } from 'sdk'

import { getGasMargin } from '../methods'


type Input = {
  to: string
  from: string
  amount?: bigint
  tokenAddress: string
  provider: BrowserProvider
}

const approve = async (values: Input) => {
  const { from, to, amount, tokenAddress, provider } = values

  const tokenContract = createErc20Contract(tokenAddress, provider)
  const signer = await provider.getSigner(from)
  const signedContract = tokenContract.connect(signer)
  const value = amount || MaxUint256

  const [ gasCost, feeData ] = await Promise.all([
    signedContract.approve.estimateGas(to, value),
    provider.getFeeData(),
  ])

  const { maxFeePerGas, maxPriorityFeePerGas } = feeData

  const gasLimit = getGasMargin(gasCost)
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
