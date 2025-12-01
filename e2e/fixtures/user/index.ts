import { createCheckExportRewards } from './checkExportRewards'
import type { CheckExportRewards } from './checkExportRewards'

import { createSetUnstakeQueue } from './setUnstakeQueue'
import type { SetUnstakeQueue } from './setUnstakeQueue'

import { createSetUnboostQueue } from './setUnboostQueue'
import type { SetUnboostQueue } from './setUnboostQueue'

import { createSetUserStats } from './setUserStats'
import type { SetUserStats } from './setUserStats'

import {
  createSetUserApy,
  createSetBoostData,
  createSetStakeBalance,
  createSetMintTokenData,
  createSetMaxWithdrawAssets,
} from './balances'

import type {
  SetUserApy,
  SetBoostData,
  SetStakeBalance,
  SetMintTokenData,
  SetMaxWithdrawAssets,
} from './balances'


export type UserFixture = {
  setUserStats: SetUserStats
  setUnboostQueue: SetUnboostQueue
  setUnstakeQueue: SetUnstakeQueue
  checkExportRewards: CheckExportRewards

  balances: {
    setUserApy: SetUserApy
    setBoostData: SetBoostData
    setStakeBalance: SetStakeBalance
    setMintTokenData: SetMintTokenData
    setMaxWithdrawAssets: SetMaxWithdrawAssets
  },
}

const user: E2E.Fixture<UserFixture> = async ({ page, helpers }, use) => {
  await use({
    setUserStats: createSetUserStats({ page }),
    setUnboostQueue: createSetUnboostQueue({ page }),
    setUnstakeQueue: createSetUnstakeQueue({ page }),
    checkExportRewards: createCheckExportRewards({ page, helpers }),

    balances: {
      setUserApy: createSetUserApy({ page }),
      setBoostData: createSetBoostData({ page }),
      setStakeBalance: createSetStakeBalance({ page }),
      setMintTokenData: createSetMintTokenData({ page }),
      setMaxWithdrawAssets: createSetMaxWithdrawAssets({ page }),
    },
  })
}


export default user
