import { getters, requests } from 'helpers'


type Input = {
  signSDK: SDK
  amount: bigint
  userAddress: string
  vaultAddress: string
}

const getDefaultCallData = async (values: Input) => {
  const { vaultAddress, userAddress, signSDK, amount } = values

  const depositWithMintVaultContract = signSDK.contracts.helpers.createVault({
    vaultAddress,
    options: {
      isDepositWithMint: true,
      chainId: signSDK.config.network.chainId,
    },
  })

  const [ { receiveShares }, { params, canHarvest }, signer ] = await Promise.all([
    requests.fetchStakeSwapData({ amount, sdk: signSDK, userAddress, vaultAddress }),
    signSDK.vault.getHarvestParams({ vaultAddress }),
    signSDK.provider.getSigner(userAddress),
  ])

  const referrerAddress = getters.getReferrer()
  const signedContract = depositWithMintVaultContract.connect(signer)

  if (canHarvest) {
    const tx = await signedContract.updateStateAndDepositAndMintOsToken.populateTransaction(
      userAddress,
      receiveShares,
      referrerAddress,
      params,
      { value: amount }
    )

    return { tx, receiveShares }
  }

  const tx = await signedContract.depositAndMintOsToken.populateTransaction(
    userAddress,
    receiveShares,
    referrerAddress,
    { value: amount }
  )

  return { tx, receiveShares }
}


export default getDefaultCallData
