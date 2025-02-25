import { useEffect, useRef } from 'react'
import { useConfig } from 'config'


const useChainChanged = (callback: () => any) => {
  const { chainId } = useConfig()

  const chainIdRef = useRef<ChainIds>(chainId)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (chainIdRef.current !== chainId) {
      callbackRef.current()
      chainIdRef.current = chainId
    }
  }, [ chainId ])
}


export default useChainChanged
