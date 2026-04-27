import { Network } from 'sdk'
import cookie from 'helpers/cookie'
import * as constants from 'helpers/constants'

import data from './data'


const E2E_RPC_URL = 'http://127.0.0.1:8545'
const E2E_MAINNET_URLS: readonly [string, string] = [ E2E_RPC_URL, E2E_RPC_URL ]

const isE2E = () => typeof window !== 'undefined' && Boolean(cookie.get(constants.cookieNames.e2e))

const getWeb3Url = (network: Network) => (
  isE2E() && network === Network.Mainnet ? E2E_MAINNET_URLS : data[network].web3
)

const getBackendUrl = (network: Network) => data[network].backend

const getSubgraphUrl = (network: Network) => data[network].subgraph


export default {
  getWeb3Url,
  getBackendUrl,
  getSubgraphUrl,
}
