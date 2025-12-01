import { Network } from 'sdk'

import * as methods from '../../methods'


type Input = {
  sdk: SDK
  withTime?: boolean
  vaultAddress: string
}

type Output = Store['vault']['base']['data']

const fetchData = async ({ sdk, withTime, vaultAddress }: Input) => {
  const mockE2E = methods.insertMockE2E<Output>('fixtures/vault/setVaultData')

  if (mockE2E) {
    return mockE2E
  }

  const [
    data,
    versions,
    feePercent,
  ] = await Promise.all([
    sdk.vault.getVault({ vaultAddress, withTime }),
    sdk.vault.getVaultVersion({ vaultAddress }),
    sdk.contracts.base.mintTokenController.feePercent(),
  ])

  const chainId = sdk.config.network.chainId
  const isGnosis = chainId === Network.Gnosis || chainId === Network.Chiado
  const isEthereum = chainId === Network.Mainnet || chainId === Network.Hoodi

  const isEditableInGnosis = isGnosis && versions.version >= 3
  const isEditableInEthereum = isEthereum && versions.version >= 5

  const isPostPectra = isEditableInGnosis || isEditableInEthereum

  return {
    ...data,
    versions,
    isPostPectra,
    protocolFeePercent: String(feePercent / 100n),
  }
}


export default fetchData
