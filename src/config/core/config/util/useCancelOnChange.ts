import { useCallback, useRef } from 'react'


type Input = {
  chainId: ChainIds
  address: string | null
}

type CallbackInput = {
  logic: () => any
  chainId: ChainIds
  address: string | null
}

const useCancelOnChange = (values: Input) => {
  const { chainId, address } = values

  const dataRef = useRef({ address, chainId })
  dataRef.current = { address, chainId }

  return useCallback((values: CallbackInput) => {
    const { address, chainId, logic } = values

    const isChainChanged = chainId !== dataRef.current.chainId
    const isAddressChanged = address !== dataRef.current.address

    if (isChainChanged || isAddressChanged) {
      return
    }

    return logic()
  }, [])
}


export default useCancelOnChange
