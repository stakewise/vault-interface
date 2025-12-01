export type SetUserStats = () => Promise<void>

type Wrapper = E2E.FixtureMethod<SetUserStats, 'page'>

type DataPoint = {
  value: number,
  time: number
}

type Output = Store['vault']['user']['rewards']['data']

const DAY = 86400
const now = Math.floor(Date.now() / 1000)
const START = now - DAY * 29

const apyMock: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  value: 2.8604074786261133,
  time: START + DAY * i,
}))

const balanceMock: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  value: 16.060180934123263,
  time: START + DAY * i,
}))

const rewardsMock: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  value: 0.001233931116484099,
  time: START + DAY * i,
}))

export const createSetUserStats: Wrapper = ({ page }) => (
  async () => {
    const data: Output = {
      apy: [ ...apyMock ].sort((a, b) => a.time - b.time),
      balance: [ ...balanceMock ].sort((a, b) => a.time - b.time),
      rewards: [ ...rewardsMock ].sort((a, b) => a.time - b.time),
    }

    await page.evaluate((payload: Output) => {
      window.e2e = {
        ...window.e2e,
        ['user/setUserStats']: payload,
      }
    }, data)
  }
)
