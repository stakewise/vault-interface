type Input = {
  signSDK: SDK
  amount: bigint
  userAddress: string
  vaultAddress: string
}

const getDefaultCallData = async (values: Input) => {
  const { amount, signSDK, userAddress, vaultAddress } = values

  const signer = await signSDK.provider.getSigner(userAddress)
  const signedContract = signSDK.contracts.special.stakeCalculator.connect(signer)

  const { params } = await signSDK.vault.getHarvestParams({ vaultAddress })

  const { receivedAssets, burnOsTokenShares, exitQueueShares } = await signedContract.calculateUnstake.staticCall({
    harvestParams: params,
    osTokenShares: amount,
    vault: vaultAddress,
    user: userAddress,
  })

  const tx = await signSDK.vaultMulticall<{ data: string, to: string }>({
    vaultAddress,
    userAddress,
    request: {
      params: [
        {
          method: 'burnOsToken',
          args: [ burnOsTokenShares ],
        },
        {
          method: 'enterExitQueue',
          args: [ exitQueueShares, userAddress ],
        },
      ],
      transactionData: true,
    },
  })

  return {
    tx,
    burnAmount: burnOsTokenShares,
    receiveAssets: receivedAssets,
  }
}


export default getDefaultCallData
