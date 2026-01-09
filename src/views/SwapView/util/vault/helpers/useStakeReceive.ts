import { useCallback, useEffect, useRef } from 'react'
import { useObjectState, useFieldListener, useStore } from 'hooks'
import { requests, constants } from 'helpers'
import { useConfig } from 'config'

import actions from '../actions'


type Input = Pick<ReturnType<typeof actions.useStake>, 'swapTokens' | 'fetchQuote' | 'field'>

type State = {
  exchangeRate: bigint
  receiveShares: bigint
  validTo: number | null
  isFetching: boolean
}

const storeSelector = (store: Store) => ({
  vaultAddress : store.vault.base.data.vaultAddress,
})

const initialState = {
  validTo: null,
  exchangeRate: 0n,
  receiveShares: 0n,
  isFetching: true,
}

const useStakeReceive = (values: Input) => {
  const { field, swapTokens, fetchQuote } = values

  const { sdk, address } = useConfig()
  const { vaultAddress } = useStore(storeSelector)
  const [ state, setState ] = useObjectState<State>(initialState)

  const getReceiveData = useCallback(async () => {
    const value = field.value || 0n

    let amount = value
    let validTo = null

    if (!amount || !vaultAddress) {
      return {
        receiveShares: 0n,
        exchangeRate: 0n,
        validTo,
      }
    }

    try {
      if (swapTokens.sellToken.address) {
        const { quote } = await fetchQuote({ sellAmount: amount })

        validTo = quote.validTo * 1000
        amount = BigInt(quote.buyAmount)
      }

      const { receiveShares, exchangeRate } = await requests.fetchStakeSwapData({
        userAddress: address,
        vaultAddress,
        amount,
        sdk,
      })

      let formattedRate = exchangeRate

      if (swapTokens.sellToken.address) {
        let divider = value

        if (swapTokens.sellToken.units !== 18) {
          const unitsDiff = BigInt(18 - swapTokens.sellToken.units)

          divider *= 10n ** unitsDiff
        }

        formattedRate = receiveShares * constants.blockchain.amount1 / divider
      }

      setState({
        validTo,
        receiveShares,
        exchangeRate: formattedRate,
        isFetching: false,
      })
    }
    catch (error) {
      console.error('error', error)

      setState({
        ...initialState,
        isFetching: false,
      })
    }
  }, [ sdk, field, address, vaultAddress, swapTokens, fetchQuote, setState ])

  const getReceiveDataRef = useRef(getReceiveData)
  getReceiveDataRef.current = getReceiveData

  const fetchingRef = useRef(state.isFetching)
  fetchingRef.current = state.isFetching

  const handleFetching = useCallback(() => {
    if (field.value) {
      if (!fetchingRef.current) {
        setState({ isFetching: true })
      }
    }
  }, [ field, setState ])

  useEffect(() => {
    if (state.validTo) {
      const diff = state.validTo - Date.now()

      // When cow quote is expired, we need to request the quote again
      const timer = setTimeout(getReceiveDataRef.current, diff)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [ state.validTo, getReceiveDataRef ])

  useEffect(() => {
    if (field.value) {
      getReceiveData()
    }
  }, [])

  useFieldListener(field, handleFetching, 0)
  useFieldListener(field, getReceiveData, 350)

  return state
}


export default useStakeReceive
