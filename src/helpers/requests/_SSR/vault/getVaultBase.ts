import { cookies } from 'next/headers'
import { networks } from 'config/core'

import { constants, getters, requests } from '../../../index'
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

  const data = await requests.vault.fetchData({ sdk, vaultAddress, withTime: true })

  return {
    data,
    isSSR: true,
    isFetching: false,
  }
}


export default getVaultBase
