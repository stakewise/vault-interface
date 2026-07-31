import { DeepPartial } from 'lightweight-charts'
import { methods, requests } from 'helpers'
import networks from 'config/networks'
import { stringify } from 'superjson'
import { Network } from 'sdk'

import getNetworkData from './getNetworkData'


const fetchStoreWithVaultData = async (): Promise<string | undefined> => {
  try {
    const { networkId, vaultAddress } = await getNetworkData()

    if (!networkId || !vaultAddress) {
      return
    }

    const chainId = networks.chainById[networkId] || Network.Mainnet
    const sdk = methods.getSDK({ chainId })

    const data = await requests.vault.fetchData({ sdk, vaultAddress, withTime: true })

    if (!data) {
      return
    }

    const vaultBase: Store['vault']['base'] = {
      data,
      isSSR: true,
      isFetching: false,
    }

    const store: DeepPartial<Store> = {
      vault: {
        base: vaultBase,
      },
    }

    return stringify(store)
  }
  catch {
    return
  }
}


export default fetchStoreWithVaultData
