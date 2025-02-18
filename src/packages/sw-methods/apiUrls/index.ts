/* eslint-disable max-len */
import { Network } from 'apps/v3-sdk'

import data from './data'


const getWeb3UrlWithoutQuiknode = (network: Network) => {
  const web3 = data[network].web3

  if (Array.isArray(web3)) {
    return web3.find((url) => !url.includes('quiknode')) as string
  }
  else {
    // @ts-ignore
    return web3.includes('quiknode')
      ? process.env.NEXT_PUBLIC_MAINNET_FALLBACK_URL || ''
      : web3 as string
  }
}

const getWeb3Url = (network: Network) => data[network].web3

const getBackendUrl = (network: Network) => data[network].backend

const getSubgraphUrl = (network: Network) => data[network].subgraph


export default {
  getWeb3Url,
  getBackendUrl,
  getSubgraphUrl,
  getWeb3UrlWithoutQuiknode,
}
