import { useCallback, useEffect, useRef } from 'react'
import { useActions, useAutoFetch, useStore } from 'hooks'
import { useConfig } from 'config'
import { getters } from 'helpers'


const storeSelector = (store: Store) => ({
  isSSR: store.vault.base.isSSR,
})

const useVaultData = () => {
  const actions = useActions()
  const { sdk, networkId } = useConfig()
  const { isSSR } = useStore(storeSelector)

  const fetchedNetworkRef = useRef(isSSR ? networkId : null)
  const vaultAddress = getters.getVaultAddress(networkId)

  const fetchVaultData = useCallback(async () => {
    if (fetchedNetworkRef.current !== networkId) {
      const vault = await sdk.vault.getVault({ vaultAddress })
      const versions = await sdk.getVaultVersion(vaultAddress)

      actions.vault.base.setData({
        ...vault,
        versions,
      })
    }

    fetchedNetworkRef.current = networkId
  }, [ sdk, actions, vaultAddress, networkId ])

  useEffect(() => {
    fetchVaultData()
  }, [ fetchVaultData ])

  useAutoFetch({
    action: fetchVaultData,
    interval: 15 * 60 * 1000,
  })
}


export default useVaultData
