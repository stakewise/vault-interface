import { Network } from 'sdk'

import apiUrls from '../apiUrls'


type Input = {
  chainId: Network
}

const getUrls = ({ chainId }: Input): StakeWise.Options['endpoints'] => {
  const api = apiUrls.getBackendUrl(chainId)
  const subgraph = apiUrls.getSubgraphUrl(chainId)
  const web3 = apiUrls.getWeb3Url(chainId)

  const urls = typeof web3 === 'string'
    ? [ web3 ]
    : web3

  const formattedWeb3 = urls.map((url) => ({
    url,
    headers: {},
  }))

  return {
    api,
    subgraph,
    web3: formattedWeb3,
  }
}


export default getUrls
