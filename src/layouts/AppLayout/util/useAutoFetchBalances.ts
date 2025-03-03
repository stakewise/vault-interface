import { useCallback, useEffect } from 'react'
import { useActions, useBalances } from 'hooks'
import { useConfig } from 'config'


let skipRequest: Record<string, boolean> = {} // If the request is too slow, you need to block the next request
const timeout = 1000 * 15

const useAutoFetchBalances = () => {
  const actions = useActions()
  const { address, networkId, autoConnectChecked } = useConfig()

  const {
    refetchDepositTokenBalance,
    refetchNativeTokenBalance,
    refetchMintTokenBalance,
  } = useBalances()

  const handleFetchBalances = useCallback(async () => {
    if (!skipRequest[networkId]) {
      skipRequest[networkId] = true

      try {
        await Promise.all([
          refetchDepositTokenBalance(),
          refetchNativeTokenBalance(),
          refetchMintTokenBalance(),
        ])
      }
      catch {}

      skipRequest[networkId] = false
    }
  }, [
    networkId,
    refetchDepositTokenBalance,
    refetchNativeTokenBalance,
    refetchMintTokenBalance,
  ])

  const fetchBalances = useCallback(async () => {
    actions.account.balances.setFetching(true)
    await handleFetchBalances()
    actions.account.balances.setFetching(false)
  }, [ actions, handleFetchBalances ])

  useEffect(() => {
    if (address) {
      fetchBalances()

      const interval = setInterval(handleFetchBalances, timeout)

      return () => {
        clearInterval(interval)
      }
    }
    else if (autoConnectChecked) {
      actions.account.balances.setFetching(false)
    }
  }, [ actions, address, autoConnectChecked, fetchBalances, handleFetchBalances ])
}


export default useAutoFetchBalances
