import { MaxUint256, parseEther } from 'ethers'
import { getGas } from 'sdk'


type Input = {
  signSDK: SDK
  to: string
  from: string
  amount?: string
  tokenAddress: string
}

const getApproveGas = async (values: Input) => {
  const { from, to, amount, tokenAddress, signSDK } = values

  const tokenContract = signSDK.contracts.helpers.createErc20(tokenAddress)
  const signer = await signSDK.provider.getSigner(from)
  const signedContract = tokenContract.connect(signer)
  const value = amount ? parseEther(amount) : MaxUint256

  const estimatedGas = await signedContract.approve.estimateGas(to, value)

  const approveTxGas = await getGas({ estimatedGas, provider: signSDK.provider })

  return approveTxGas
}


export default getApproveGas
