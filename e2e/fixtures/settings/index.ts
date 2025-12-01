import { createSetTheme, SetTheme } from './setTheme'
import { createCheckTheme, CheckTheme } from './checkTheme'
import { createCheckCurrency, CheckCurrency } from './checkCurrency'


export type SettingsFixture = {
  setTheme: SetTheme
  checkTheme: CheckTheme
  checkCurrency: CheckCurrency
}

const settings: E2E.Fixture<SettingsFixture> = async ({ page, element, helpers }, use) => {
  await use({
    setTheme: createSetTheme({ page, helpers }),
    checkTheme: createCheckTheme({ page, helpers }),
    checkCurrency: createCheckCurrency({ page, element, helpers }),
  })
}


export default settings
