/* eslint-disable max-len */
import { Network } from 'apps/v3-sdk'

import data from './data'


const getWeb3Url = (network: Network) => data[network].web3

const getBackendUrl = (network: Network) => data[network].backend

const getSubgraphUrl = (network: Network) => data[network].subgraph


export default {
  getWeb3Url,
  getBackendUrl,
  getSubgraphUrl,
}
