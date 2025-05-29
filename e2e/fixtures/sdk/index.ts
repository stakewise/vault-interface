import { createMint, Mint } from './mint'
import { createDeposit, Deposit } from './deposit'
import { createGetMaxMint, GetMaxMint } from './getMaxMint'


export type SDKFixture = {
  mint: Mint
  deposit: Deposit
  getMaxMint: GetMaxMint
}

const sdk: E2E.Fixture<SDKFixture> = async ({ page }, use) => {
  await use({
    mint: createMint({ page }),
    deposit: createDeposit({ page }),
    getMaxMint: createGetMaxMint({ page }),
  })
}


export default sdk
