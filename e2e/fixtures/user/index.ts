import { createCheckExportRewards } from './checkExportRewards'
import type { CheckExportRewards } from './checkExportRewards'

import { createSetUnstakeQueue } from './setUnstakeQueue'
import type { SetUnstakeQueue } from './setUnstakeQueue'

import { createSetUnboostQueue } from './setUnboostQueue'
import type { SetUnboostQueue } from './setUnboostQueue'

import { createSetUserStats } from './setUserStats'
import type { SetUserStats } from './setUserStats'

import {
  createSetBoostData,
  createSetMintTokenData,
} from './balances'

import type {
  SetBoostData,
  SetMintTokenData,
} from './balances'


export type UserFixture = {
  setUserStats: SetUserStats
  setUnboostQueue: SetUnboostQueue
  setUnstakeQueue: SetUnstakeQueue
  checkExportRewards: CheckExportRewards

  balances: {
    setBoostData: SetBoostData
    setMintTokenData: SetMintTokenData
  },
}

const user: E2E.Fixture<UserFixture> = async ({ page, helpers }, use) => {
  await use({
    setUserStats: createSetUserStats({ page }),
    setUnboostQueue: createSetUnboostQueue({ page }),
    setUnstakeQueue: createSetUnstakeQueue({ page }),
    checkExportRewards: createCheckExportRewards({ page, helpers }),

    balances: {
      setBoostData: createSetBoostData({ page }),
      setMintTokenData: createSetMintTokenData({ page }),
    },
  })
}


export default user
