import { useCallback } from 'react'
import { useConfig } from 'config'
// import { fetchMintTokenBalanceQuery } from 'graphql/subgraph/swap' // TODO replace with sdk


const useMintTokenBalance = () => {
  const { sdk, address } = useConfig()

  return useCallback(async () => {
    return 0n
    // if (!address) {
    //   return 0n
    // }
    //
    // try {
    //   const result = await fetchMintTokenBalanceQuery({
    //     url: sdk.config.api.subgraph,
    //     requestPolicy: 'no-cache',
    //     variables: {
    //       address: address.toLowerCase(),
    //     },
    //     modifyResult: (data) => BigInt(data?.osTokenHolders[0]?.balance || 0),
    //   })
    //
    //   return result
    // }
    // catch (error) {
    //   return Promise.reject('Stake: fetchMintTokenBalance error')
    // }
  }, [ address, sdk ])
}


export default useMintTokenBalance
