import { formatEther, getAddress, MaxUint256, ZeroAddress } from 'ethers'

import * as constants from '../../constants'


export type SetVaultData = (data?: any) => Promise<void>

type Output = Store['vault']['base']['data']

type Wrapper = E2E.FixtureMethod<SetVaultData, 'page' | 'wallet'>

export const createSetVaultData: Wrapper = ({ page, wallet }) => (
  async (data) => {
    const address = data?.admin || wallet.tryGetAddress() || ZeroAddress

    const vaultAddress = getAddress(data?.address || constants.metaVault)
    const capacity = data?.capacity || String(constants.maxUint256)
    const feePercent = (data?.feePercent || 450) / 100

    const result: Output = {
      feePercent,
      vaultAddress,
      subVaultsCount: 0,
      exitingAssets: '0',
      exitingTickets: '0',
      subVaultsCurator: '',
      isSmoothingPool: false,
      canHarvest: false,
      avgQueueDays: 0,
      ejectingSubVault: '',
      subVaultsRegistry: '',
      pendingMetaSubVault: '',
      protocolFeePercent: '0',
      isStateUpdateRequired: false,
      imageUrl: data?.imageUrl || '',
      isErc20: data?.isErc20 ?? false,
      vaultAdmin: getAddress(address),
      apy: Number(data?.apy || '2.42'),
      tokenName: data?.tokenName || null,
      isPrivate: data?.isPrivate ?? true,
      description: data?.description || '',
      tokenSymbol: data?.tokenSymbol || null,
      queuedShares: data?.queuedShares || '0',
      isBlocklist: data?.isBlocklist ?? false,
      baseApy: Number(data?.baseApy || '0.80'),
      depositDataRoot: data?.depositDataRoot || '',
      displayName: data?.displayName || 'Mock Vault',
      isCollateralized: data?.isCollateralized ?? true,
      performance: Number(data?.performance || '97.65'),
      lastFeePercent: (data?.lastFeePercent || 500) / 100,
      blocklistCount: Number(data?.blocklistCount || '0'),
      whitelistCount: Number(data?.whitelistCount || '0'),
      whitelistManager: address ? getAddress(address) : '',
      validatorsManager: address ? getAddress(address) : '',
      depositDataManager: address ? getAddress(address) : '',
      createdAt: Number(data?.createdAt || '1701031871') * 1000,
      allocatorMaxBoostApy: Number(data?.allocatorMaxBoostApy || '22.11'),
      lastFeeUpdateTimestamp: data?.lastFeeUpdateTimestamp || '1757670504',
      totalAssets: formatEther(data?.totalAssets || '32100978717000000000'),
      feeRecipient: getAddress(data?.feeRecipient || constants.feeRecipient),
      isMetaVault: data?.isMetaVault ?? vaultAddress === constants.metaVault,
      isGenesis: data?.isGenesis ?? vaultAddress === constants.genesisAddress.mainnet,
      blocklistManager: data?.blocklistManager ? getAddress(data?.blocklistManager) : '',
      mevRecipient: getAddress(data?.mevEscrow || '0x5ab14b64fb24c170671edb69b76812e4e05d558c'),
      capacity: capacity !== MaxUint256.toString()
        ? formatEther(capacity)
        : '∞',
      osTokenConfig: {
        liqThresholdPercent: data?.osTokenConfig?.liqThresholdPercent || '18446744073709551615',
        ltvPercent: data?.osTokenConfig?.ltvPercent || '999900000000000000',
      },
      versions: {
        version: Number(data?.version || '5'),
        isV1Version: false,
        isV2Version: false,
        isMoreV1: true,
        isMoreV2: true,
      },
      isPostPectra: true,
    }

    await page.addInitScript((payload) => {
      window.e2e = {
        ...window.e2e,
        ['fixtures/vault/setVaultData']: payload,
      }
    }, result)
  }
)
