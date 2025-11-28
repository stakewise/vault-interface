import { createSetOsTokenApy, SetOsTokenApy } from './setOsTokenApy'


export type OsTokenFixture = {
  setOsTokenApy: SetOsTokenApy
}

const osToken: E2E.Fixture<OsTokenFixture> = async ({ page }, use) => {
  await use({
    setOsTokenApy: createSetOsTokenApy({ page }),
  })
}


export default osToken
