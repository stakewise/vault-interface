import { Network } from 'sdk'

import apiUrls from '../apiUrls'
import getTestUrl from './getTestUrl'
import getQuikNodeHeaders from './getQuikNodeHeaders'


type Input = {
  chainId: Network
  token?: string
}

const getUrls = ({ chainId, token }: Input): StakeWise.Options['endpoints'] => {
  const api = apiUrls.getBackendUrl(chainId)
  const subgraph = apiUrls.getSubgraphUrl(chainId)

  const testUrl = getTestUrl()

  if (testUrl) {
    return {
      api,
      subgraph,
      web3: testUrl,
    }
  }

  const web3 = apiUrls.getWeb3Url(chainId)

  const urls = typeof web3 === 'string'
    ? [ web3 ]
    : web3

  const formattedWeb3 = urls.map((url) => ({
    url,
    headers: url.includes('quiknode')
      ? getQuikNodeHeaders(token)
      : {},
  }))

  return {
    api,
    subgraph,
    web3: formattedWeb3,
  }
}


export default getUrls
