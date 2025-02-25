import { getters, requests } from 'helpers'


type Input = {
  signSDK: SDK
  amount: bigint
  userAddress: string
  vaultAddress: string
}

const getGnosisCallData = async (values: Input) => {
  const { amount, userAddress, vaultAddress, signSDK } = values

  const referrerAddress = getters.getReferrer()

  const { receiveShares } = await requests.fetchStakeSwapData({
    sdk: signSDK,
    vaultAddress,
    userAddress,
    amount,
  })

  const tx = await signSDK.vaultMulticall<{ data: string, to: string }>({
    vaultAddress,
    userAddress,
    request: {
      params: [
        {
          method: 'deposit',
          args: [ amount, userAddress, referrerAddress ],
        },
        {
          method: 'mintOsToken',
          args: [ userAddress, receiveShares, referrerAddress ],
        },
      ],
      transactionData: true,
    },
  })

  return { tx, receiveShares }
}


export default getGnosisCallData
