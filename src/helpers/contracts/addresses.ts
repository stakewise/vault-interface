import { Network } from 'sdk'
import { ZeroAddress } from 'ethers'


const addresses = {
  [Network.Mainnet]: {
    base: {
      merkleDistributorV2: '0xa9dc250dF4EE9273D09CFa455da41FB1cAC78d34',
    },
    cow: {
      vaultRelayer: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
    },
  },
  [Network.Hoodi]: {
    base: {
      merkleDistributorV2: '0xc61847D6fc1F64162ff9f1D06205d9C4cDb2F239',
    },
    cow: {
      vaultRelayer: ZeroAddress,
    },
  },
  [Network.Gnosis]: {
    base: {
      merkleDistributorV2: '0xFBceefdBB0ca25a4043b35EF49C2810425243710',
    },
    cow: {
      vaultRelayer: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
    },
  },
  [Network.Chiado]: {
    base: {
      merkleDistributorV2: '0xd0747320d5457256D0203dfe61209Afbb90d22D7',
    },
    cow: {
      vaultRelayer: ZeroAddress,
    },
  },
}


export default addresses
