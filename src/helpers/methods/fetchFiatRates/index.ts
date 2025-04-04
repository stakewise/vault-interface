import { Network } from 'sdk'

import fetchGnosisRates from './fetchGnosisRates'
import fetchMainnetRates from './fetchMainnetRates'


const fetchFiatRates = async (network: Network) => {
  const isGnosis = [ Network.Gnosis, Network.Chiado ].includes(network)
  const isEthereum = [ Network.Mainnet, Network.Hoodi ].includes(network)

  if (isGnosis) {
    return fetchGnosisRates()
  }

  if (isEthereum) {
    return fetchMainnetRates()
  }
}


export default fetchFiatRates
