import { useEffect } from 'react'
import { useConfig } from 'config'
// import { getTokenHoldersQueryCache } from 'graphql/subgraph/tokenTransfers'


const useResetCache = () => {
  const { sdk } = useConfig()

  useEffect(() => {
    // const cache = getTokenHoldersQueryCache(sdk.config.api.subgraph)
    //
    // return () => {
    //   cache.resetData()
    // }
  }, [ sdk ])
}


export default useResetCache
