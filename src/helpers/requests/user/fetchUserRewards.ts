import { insertMockE2E } from '../../methods'


type Input = {
  sdk: SDK
  days: number
  userAddress: string
  vaultAddress: string
}

type Output = Store['vault']['user']['rewards']['data']

const fetchUserRewards = async (values: Input): Promise<Output> => {
  const { userAddress, vaultAddress, days, sdk } = values

  const mockE2E = insertMockE2E<Output>('user/setUserStats')

  if (mockE2E) {
    return mockE2E
  }

  const data = await sdk.vault.getUserStats({
    daysCount: days,
    vaultAddress,
    userAddress,
  })

  return data
}


export default fetchUserRewards
