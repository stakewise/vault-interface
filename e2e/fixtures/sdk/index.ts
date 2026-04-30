import { createMint, Mint } from './mint'
import { createDeposit, Deposit } from './deposit'


export type SDKFixture = {
  mint: Mint
  deposit: Deposit
}

const sdk: E2E.Fixture<SDKFixture> = async ({ page, wallet }, use) => {
  await use({
    mint: createMint({ page, wallet }),
    deposit: createDeposit({ page, wallet }),
  })
}


export default sdk
