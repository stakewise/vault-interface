import { useEffect, useRef } from 'react'
import { useConfig } from 'config'


const useChainChanged = (): boolean => {
  const { chainId } = useConfig()
  const ref = useRef<ChainIds>(chainId)

  useEffect(() => {
    ref.current = chainId
  }, [ chainId ])

  return chainId !== ref.current
}


export default useChainChanged
