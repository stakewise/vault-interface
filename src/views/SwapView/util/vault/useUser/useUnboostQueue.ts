import { useCallback, useMemo } from 'react'
import { useMountedRef, useActions } from 'hooks'
import { methods } from 'helpers'
import { useConfig } from 'config'


type Output = Store['vault']['user']['unboostQueue']['data']

const useUnboostQueue = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { sdk, address, isEthereum } = useConfig()

  const fetchUnboostQueue = useCallback(async () => {
    if (address && vaultAddress && isEthereum) {
      try {
        actions.vault.user.unboostQueue.setFetching(true)

        const mockE2E = methods.insertMockE2E<Output>('user/setUnboostQueue')

        if (mockE2E) {
          actions.vault.user.unboostQueue.setData(mockE2E)

          return
        }

        const unboostQueue = await sdk.boost.getQueuePosition({
          userAddress: address,
          vaultAddress,
        })

        if (mountedRef.current) {
          actions.vault.user.unboostQueue.setData(unboostQueue)
        }
      }
      catch (error: any) {
        console.error('Fetch UnboostQueue error', error)
        actions.vault.user.unboostQueue.setFetching(false)
      }
    }
  }, [ sdk, actions, address, mountedRef, vaultAddress, isEthereum ])

  const resetUnboostQueue = useCallback(() => {
    actions.vault.user.unboostQueue.resetData()
  }, [ actions ])

  return useMemo(() => ({
    fetchUnboostQueue,
    resetUnboostQueue,
  }), [
    fetchUnboostQueue,
    resetUnboostQueue,
  ])
}


export default useUnboostQueue
