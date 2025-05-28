import { createCheckUnboostBalances, CheckUnboostBalances } from './checkUnboostBalances'
import { createCheckUnstakeBalances, CheckUnstakeBalances } from './checkUnstakeBalances'


export type QueueFixture = {
  checkUnboostBalances: CheckUnboostBalances
  checkUnstakeBalances: CheckUnstakeBalances
}

const queue: E2E.Fixture<QueueFixture> = async ({ page, element }, use) => {
  await use({
    checkUnstakeBalances: createCheckUnstakeBalances({ page }),
    checkUnboostBalances: createCheckUnboostBalances({ page, element }),
  })
}


export default queue
