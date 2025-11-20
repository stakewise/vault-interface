import { useConfig } from 'config'

import useChangeEffect from './useChangeEffect'


const useChainChanged = (callback: (chainId: ChainIds) => any) => {
  const { chainId } = useConfig()

  useChangeEffect<[ ChainIds, (chainId: ChainIds) => any ]>((prevChainId) => {
    if (prevChainId !== chainId) {
      callback(chainId)
    }
  }, [ chainId, callback ])
}


export default useChainChanged
