import { cookies } from 'next/headers'

import { constants, getters } from '../../index'


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


export default getNetworkData
