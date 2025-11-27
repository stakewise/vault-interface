import { useCallback, useMemo, useRef } from 'react'
import { useStore, useActions, useMountedRef } from 'hooks'
import { useConfig } from 'config'


const storeSelector = (store: Store) => ({
  isSSR: store.vault.base.isSSR,
})

const useVaultData = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { isSSR } = useStore(storeSelector)
  const { sdk, isGnosis, isEthereum } = useConfig()

  const isSsrRef = useRef(isSSR)
  isSsrRef.current = isSSR

  const fetchVault = useCallback(async () => {
    const isSSR = isSsrRef.current

    if (isSSR) {
      // We need this property only for the first render, after that it will prevent us from refetching.
      actions.vault.base.resetSSR()

      return
    }

    try {
      actions.vault.base.setFetching(true)

      const vault = await sdk.vault.getVault({ vaultAddress })
      const versions = await sdk.vault.getVaultVersion({ vaultAddress })
      const feePercent = await sdk.contracts.base.mintTokenController.feePercent()

      const isEditableInGnosis = isGnosis && versions.version >= 3
      const isEditableInEthereum = isEthereum && versions.version >= 5
      const isPostPectra = isEditableInGnosis || isEditableInEthereum

      if (mountedRef.current) {
        actions.vault.base.setData({
          ...vault,
          versions,
          isPostPectra,
          protocolFeePercent: String(feePercent / 100n),
        })
      }
    }
    catch (error: any) {
      console.error('Fetch vault base data fail', error)
      actions.vault.base.setFetching(false)
    }
  }, [ actions, mountedRef, sdk, vaultAddress, isEthereum, isGnosis ])

  const resetVault = useCallback(() => {
    actions.vault.base.resetData()
  }, [ actions ])

  return useMemo(() => ({
    resetVault,
    fetchVault,
  }), [
    resetVault,
    fetchVault,
  ])
}


export default useVaultData
