import { createDelay, Delay } from './delay'
import { createChangeSelect, ChangeSelect } from './changeSelect'
import { createCheckBalances, CheckBalances } from './checkBalances'
import { createGetCookiesItem, GetCookiesItem } from './getCookiesItem'
import { createCheckNotification, CheckNotification } from './checkNotification'
import { createGetLocalStorageItem, GetLocalStorageItem } from './getLocalStorageItem'


export type HelpersFixture = {
  delay: Delay
  changeSelect: ChangeSelect
  checkBalances: CheckBalances
  getCookiesItem: GetCookiesItem
  checkNotification: CheckNotification
  getLocalStorageItem: GetLocalStorageItem
}

const helpers: E2E.Fixture<HelpersFixture> = async ({ page, element }, use) => {
  await use({
    delay: createDelay(),
    changeSelect: createChangeSelect({ page }),
    checkBalances: createCheckBalances({ page }),
    getCookiesItem: createGetCookiesItem({ page }),
    getLocalStorageItem: createGetLocalStorageItem({ page }),
    checkNotification: createCheckNotification({ page, element }),
  })
}


export default helpers
