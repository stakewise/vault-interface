import { useRef, useCallback, useMemo } from 'react'
import { useObjectState, useFieldListener } from 'hooks'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { useAPY } from 'views/HomeView/content/util'


export type Data = {
  gas: bigint
  rate: bigint
  receive: bigint
  isFetching: boolean
}

const initialState = {
  gas: 0n,
  rate: 0n,
  receive: 0n,
  isFetching: true,
}

const useData = () => {
  const { stake, field } = stakeCtx.useData()
  const { newAPY, isFetching: isApyFetching } = useAPY('stake')
  const [ state, setState ] = useObjectState<Data>(initialState)

  const fetchingRef = useRef(state.isFetching)
  fetchingRef.current = state.isFetching

  const handleFetching = useCallback(() => {
    if (field.value) {
      if (!fetchingRef.current) {
        setState({ isFetching: true })
      }
    }
  }, [ field, setState ])

  const calculateData = useCallback(async () => {
    if (!field.value || field.error) {
      setState({
        ...initialState,
        isFetching: false,
      })

      return
    }

    try {
      const [ { receiveShares, exchangeRate }, gas ] = await Promise.all([
        stake.calculateSwap(field.value || 0n),
        stake.getTransactionGas(),
      ])

      setState({
        gas,
        rate: exchangeRate,
        receive: receiveShares,
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
  }, [ field, stake, setState ])

  useFieldListener(field, handleFetching, 0)
  useFieldListener(field, calculateData, 350)

  return useMemo(() => ({
    ...state,
    newAPY,
    isFetching: state.isFetching || isApyFetching,
  }), [ isApyFetching, newAPY, state ])
}


export default useData
