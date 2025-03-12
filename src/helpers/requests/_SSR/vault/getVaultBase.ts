import methods from 'sw-methods'
import { cookies } from 'next/headers'
import { networks } from 'sw-core'
import { constants, getters } from 'helpers'


const getNetworkData = () => {
  const cookieNetworkId = cookies().get(constants.cookieNames.networkId)?.value as NetworkIds
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
  const { networkId, vaultAddress } = getNetworkData()

  if (!networkId || !vaultAddress) {
    return null
  }

  const chainId = networks.chainById[networkId as NetworkIds]
  const sdk = methods.getSDK({ chainId })
  const data = await sdk.vault.getVault({ vaultAddress, withTime: true })
  const versions = await sdk.getVaultVersion(vaultAddress)

  return {
    data: {
      ...data,
      versions,
    },
    isSSR: true,
    isFetching: false,
  }
}


export default getVaultBase
