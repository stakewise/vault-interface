import { useRef, useCallback } from 'react'
import { useObjectState, useFieldListener } from 'hooks'


const initialState = {
  gas: 0n,
  rate: 0n,
  vaultAssets: 0n,
  exchangeAssets: 0n,
  isFetching: false,
}

type Input = {
  field: Forms.Field<bigint>
  calculateSwap: StakePage.Unstake.Actions['calculateSwap']
  getTransactionGas: StakePage.Unstake.Actions['getTransactionGas']
}

const useData = ({ field, calculateSwap, getTransactionGas }: Input) => {
  const [ state, setState ] = useObjectState<StakePage.Unstake.TxData>(initialState)

  const fetchingRef = useRef(state.isFetching)
  fetchingRef.current = state.isFetching

  const handleFetching = useCallback((field: Forms.Field<bigint>) => {
    if (field.value) {
      if (!fetchingRef.current) {
        setState({ isFetching: true })
      }
    }
  }, [ setState ])

  const calculateData = useCallback(async (field: Forms.Field<bigint>) => {
    if (!field.value || field.error) {
      setState({
        ...initialState,
        isFetching: false,
      })

      return
    }

    try {
      const { swapData, exchangeRate } = await calculateSwap(field.value || 0n)

      const gas = await getTransactionGas()

      const calculateData = swapData.reduce((acc, data) => {
        const { receiveAssets, isVaultAction, isExchange } = data

        const vaultAssets = isVaultAction
          ? acc.vaultAssets + receiveAssets
          : acc.vaultAssets

        const exchangeAssets = isExchange
          ? acc.exchangeAssets + receiveAssets
          : acc.exchangeAssets

        return {
          vaultAssets,
          exchangeAssets,
        }
      }, {
        vaultAssets: 0n,
        exchangeAssets: 0n,
      })

      setState({
        gas,
        rate: exchangeRate,
        isFetching: false,
        ...calculateData,
      })
    }
    catch (error) {
      console.log(error)

      setState({
        ...initialState,
        isFetching: false,
      })
    }
  }, [ setState, calculateSwap, getTransactionGas ])

  useFieldListener(field, handleFetching, 0)
  useFieldListener(field, calculateData, 350)

  return state
}


export default useData
