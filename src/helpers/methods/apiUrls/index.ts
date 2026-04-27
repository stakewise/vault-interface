import { Network } from 'sdk'

import getRpcForE2E from '../getRpcForE2E'

import data from './data'


const getWeb3Url = (network: Network) => {
  const e2eRpc = getRpcForE2E()

  return e2eRpc || data[network].web3
}

const getBackendUrl = (network: Network) => data[network].backend

const getSubgraphUrl = (network: Network) => data[network].subgraph


export default {
  getWeb3Url,
  getBackendUrl,
  getSubgraphUrl,
}
