import * as constants from '../../constants'
import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockVaultData, 'page'>

export type MockVaultData = (data?: Record<string, any>) => Promise<void>

export const createMockVaultData: Wrapper = ({ page }) => (
  async (data) => {
    let address = ''

    if (data?.admin) {
      address = data.admin
    }
    else {
      address = await page.evaluate('window.ethereum.signer.address')
    }

    await mockCustomDataOnce<any>({
      page,
      name: 'Vault',
      data: {
        vault: {
          apy: '2.42',
          version: '3',
          admin: address,
          isErc20: false,
          imageUrl: '',
          isPrivate: true,
          tokenName: null,
          feePercent: 450,
          isGenesis: true,
          description: '',
          tokenSymbol: null,
          queuedShares: '0',
          isBlocklist: false,
          blocklistCount: '0',
          whitelistCount: '0',
          performance: '97.65',
          whitelister: address,
          depositDataRoot: '',
          isCollateralized: true,
          blocklistManager: '',
          createdAt: '1701031871',
          displayName: 'Mock Vault',
          validatorsManager: address,
          depositDataManager: address,
          allocatorMaxBoostApy: '22.11',
          osTokenHolderMaxBoostApy: '22.11',
          totalAssets: '32100978717000000000',
          feeRecipient: constants.feeRecipient,
          address: '0xac0f906e433d58fa868f936e8a43230473652885',
          mevEscrow: '0x5ab14b64fb24c170671edb69b76812e4e05d558c',
          capacity: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          osTokenConfig: {
            liqThresholdPercent: '920000000000000000',
            ltvPercent: '900000000000000000',
          },
          ...data,
        },
      },
    })
  }
)
