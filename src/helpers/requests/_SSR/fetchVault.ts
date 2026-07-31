import { methods, requests } from 'helpers'
import networks from 'config/networks'
import { Network } from 'sdk'

import getNetworkData from './getNetworkData'


type Output = Awaited<ReturnType<typeof requests.vault.fetchData>>

const fetchVault = async (): Promise<Output | undefined> => {
  try {
    const { networkId, vaultAddress } = await getNetworkData()

    if (!networkId || !vaultAddress) {
      return
    }

    const chainId = networks.chainById[networkId] || Network.Mainnet
    const sdk = methods.getSDK({ chainId })

    const data = await requests.vault.fetchData({ sdk, vaultAddress, withTime: true })

    return data
  }
  catch {}
}


export default fetchVault
