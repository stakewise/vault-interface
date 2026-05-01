import { createSetVaultData, SetVaultData } from './setVaultData'


export type VaultFixture = {
  setVaultData: SetVaultData
}

const vault: E2E.Fixture<VaultFixture> = async ({ page, wallet }, use) => {
  await use({
    setVaultData: createSetVaultData({ page, wallet }),
  })
}


export default vault
