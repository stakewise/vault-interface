import { Network } from 'sdk'


const addresses = {
  [Network.Mainnet]: {
    base: {
      merkleDistributorV2: '0xa9dc250dF4EE9273D09CFa455da41FB1cAC78d34',
    },
  },
  [Network.Hoodi]: {
    base: {
      merkleDistributorV2: '0xc61847D6fc1F64162ff9f1D06205d9C4cDb2F239',
    },
  },
  [Network.Gnosis]: {
    base: {
      merkleDistributorV2: '0xFBceefdBB0ca25a4043b35EF49C2810425243710',
    },
  },
  [Network.Chiado]: {
    base: {
      merkleDistributorV2: '0xd0747320d5457256D0203dfe61209Afbb90d22D7',
    },
  },
}


export default addresses
