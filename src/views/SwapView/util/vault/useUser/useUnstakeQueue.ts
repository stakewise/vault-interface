import { useCallback, useMemo } from 'react'
import { useMountedRef, useActions } from 'hooks'
import { methods } from 'helpers'
import { useConfig } from 'config'


type Output = Store['vault']['user']['unstakeQueue']['data']

const useUnstakeQueue = (vaultAddress: string) => {
  const actions = useActions()
  const mountedRef = useMountedRef()
  const { sdk, address } = useConfig()

  const fetchUnstakeQueue = useCallback(async () => {
    if (address && vaultAddress) {
      try {
        actions.vault.user.unstakeQueue.setFetching(true)

        const mockE2E = methods.insertMockE2E<Output>('user/setUnstakeQueue')

        if (mockE2E) {
          actions.vault.user.unstakeQueue.setData(mockE2E)

          return
        }

        const exitQueue = await sdk.vault.getExitQueuePositions({
          userAddress: address,
          isClaimed: false,
          vaultAddress,
        })

        if (mountedRef.current) {
          actions.vault.user.unstakeQueue.setData({
            withdrawable: exitQueue.withdrawable,
            positions: exitQueue.positions,
            duration: exitQueue.duration,
            requests: exitQueue.requests,
            total: exitQueue.total,
          })
        }
      }
      catch (error: any) {
        console.error('Fetch ExitQueue error', error)

        actions.vault.user.unstakeQueue.setFetching(false)
      }
    }
  }, [ sdk, actions, address, mountedRef, vaultAddress ])

  const resetUnstakeQueue = useCallback(() => {
    actions.vault.user.unstakeQueue.resetData()
  }, [ actions ])

  return useMemo(() => ({
    fetchUnstakeQueue,
    resetUnstakeQueue,
  }), [
    fetchUnstakeQueue,
    resetUnstakeQueue,
  ])
}


export default useUnstakeQueue
