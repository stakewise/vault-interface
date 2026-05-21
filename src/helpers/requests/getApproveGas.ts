import { getGas, createErc20Contract } from 'sdk'
import { BrowserProvider, MaxUint256, parseEther } from 'ethers'


type Input = {
  to: string
  from: string
  amount?: string
  tokenAddress: string
  provider: BrowserProvider
}

const getApproveGas = async (values: Input) => {
  const { from, to, amount, tokenAddress, provider } = values

  const tokenContract = createErc20Contract(tokenAddress, provider)
  const signer = await provider.getSigner(from)
  const signedContract = tokenContract.connect(signer)
  const value = amount ? parseEther(amount) : MaxUint256

  const estimatedGas = await signedContract.approve.estimateGas(to, value)

  const approveTxGas = await getGas({ estimatedGas, provider })

  return approveTxGas
}


export default getApproveGas
