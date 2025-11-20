import { VoidSigner } from 'ethers'
import { blockchain } from '../constants'


type Input = {
  sdk: SDK
  amount: bigint
  vaultAddress: string
  userAddress?: string | null
}

const fetchStakeSwapData = async (values: Input) => {
  const { amount, sdk, userAddress, vaultAddress } = values

  const signer = new VoidSigner(blockchain.emptyAddress, sdk.provider)

  const { params } = await sdk.vault.getHarvestParams({ vaultAddress })
  const signedContract = sdk.contracts.special.stakeCalculator.connect(signer)

  const {
    exchangeRate,
    receivedOsTokenShares: receiveShares,
  } = await signedContract.calculateStake.staticCall({
    user: userAddress || blockchain.emptyAddress,
    harvestParams: params,
    vault: vaultAddress,
    stakeAssets: amount,
  })

  return {
    receiveShares,
    exchangeRate,
  }
}


export default fetchStakeSwapData
