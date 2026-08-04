import { mergeRewardsFiat } from 'sdk'


export type SetUserRewards = () => Promise<void>

type Wrapper = E2E.FixtureMethod<SetUserRewards, 'page'>

type Output = ReturnType<typeof mergeRewardsFiat>

export const createSetUserRewards: Wrapper = ({ page }) => (
  async () => {
    const DAY = 86400
    const START = 1704091487

    const data: Output = Array.from({ length: 30 }, (_, i) => ({
      date: START + DAY * i,
      dailyRewards: 2.8604074786261133,
      dailyRewardsUsd: 2.8604074786261133,
      dailyRewardsEur: 2.8604074786261133,
      dailyRewardsGbp: 2.8604074786261133,
      dailyRewardsCny: 2.8604074786261133,
      dailyRewardsJpy: 2.8604074786261133,
      dailyRewardsKrw: 2.8604074786261133,
      dailyRewardsAud: 2.8604074786261133,
      dailyStakeRewards: 2.8604074786261133,
      dailyBoostRewards: 2.8604074786261133,
    }))

    await page.evaluate((payload) => {
      window.e2e = {
        ...window.e2e,
        ['user/setUserRewards']: payload,
      }
    }, data)
  }
)
