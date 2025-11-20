import { cookies } from 'next/headers'
import { networks } from 'config/core'
import { Network } from 'sdk'

import { constants, getters } from '../../../index'
import { getSDK } from '../../../methods'


const getNetworkData = async () => {
  const cookieStore = await cookies()
  const cookieNetworkId = cookieStore.get(constants.cookieNames.networkId)?.value as NetworkIds
  const vaultAddressByCookie = getters.getVaultAddress(cookieNetworkId)

  if (vaultAddressByCookie) {
    return {
      networkId: cookieNetworkId,
      vaultAddress: vaultAddressByCookie,
    }
  }

  const networkId = getters.getDefaultNetwork()
  const vaultAddress = getters.getVaultAddress(networkId as NetworkIds)

  return {
    networkId,
    vaultAddress,
  }
}

const getVaultBase = async () => {
  const { networkId, vaultAddress } = await getNetworkData()

  if (!networkId || !vaultAddress) {
    return null
  }

  const chainId = networks.chainById[networkId as NetworkIds]
  const sdk = getSDK({ chainId })
  const data = await sdk.vault.getVault({ vaultAddress, withTime: true })
  const versions = await sdk.getVaultVersion(vaultAddress)

  const feePercent = await sdk.contracts.base.mintTokenController.feePercent()

  const isEditableInGnosis = sdk.network === Network.Gnosis && versions.version >= 3
  const isEditableInEthereum = sdk.network === Network.Mainnet && versions.version >= 5
  const isPostPectra = isEditableInGnosis || isEditableInEthereum

  return {
    data: {
      ...data,
      versions,
      isPostPectra,
      protocolFeePercent: String(feePercent / 100n),
    },
    isSSR: true,
    isFetching: false,
  }
}


export default getVaultBase
