import { createSetBalance, SetBalance } from './setBalance'


export type AnvilFixture = {
  setBalance: SetBalance
}

const anvil: E2E.Fixture<AnvilFixture> = async ({ page }, use) => {
  await use({
    setBalance: createSetBalance({ page }),
  })
}


export default anvil
