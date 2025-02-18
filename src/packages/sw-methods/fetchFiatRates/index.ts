import { Network } from 'sdk'

import fetchGnosisRates from './fetchGnosisRates'
import fetchMainnetRates from './fetchMainnetRates'


const fetchFiatRates = async (network: Network) => {
  const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(network)
  const isMainnet = [ Network.Mainnet, Network.Holesky ].includes(network)

  if (isGnosis) {
    return fetchGnosisRates()
  }

  if (isMainnet) {
    return fetchMainnetRates()
  }
}


export default fetchFiatRates
