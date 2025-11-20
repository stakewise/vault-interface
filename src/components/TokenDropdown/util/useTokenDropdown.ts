import { useCallback, useMemo } from 'react'
import { useConfig } from 'config'
import { useBalances, useChainChanged, useAutoFetch, useObjectState } from 'hooks'

import useSwapTokenRates from './useSwapTokenRates'


type State = {
  fetchedKey: string
  isOpen: boolean
  isFetching: boolean
}

const useTokenDropdown = () => {
  const { address, chainId } = useConfig()
  const [ { fetchedKey, isOpen, isFetching }, setState ] = useObjectState<State>({
    fetchedKey: '',
    isOpen: false,
    isFetching: true,
  })

  const fetchRates = useSwapTokenRates()
  const { refetchSwapTokenBalances } = useBalances()

  const dataKey = `${address}-${chainId}`

  const handleFetch = useCallback(async () => {
    if (isOpen) {
      setState({ isFetching: true })

      await Promise.all([
        refetchSwapTokenBalances(),
        fetchRates(),
      ])

      setState({ fetchedKey: dataKey, isFetching: false })
    }
  }, [ isOpen, dataKey, setState, fetchRates, refetchSwapTokenBalances ])

  useChainChanged(handleFetch)

  useAutoFetch({
    action: handleFetch,
    interval: 15 * 60 * 1000,
    skip: !isOpen,
  })

  const open = useCallback((isOpen: boolean) => {
    setState({ isOpen })
  }, [])

  return useMemo(() => ({
    isFetching: isFetching && fetchedKey !== dataKey,
    open,
  }), [
    dataKey,
    fetchedKey,
    isFetching,
    open,
  ])
}


export default useTokenDropdown
