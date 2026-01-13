import { Network } from 'sdk'
import { ZeroAddress } from 'ethers'


const addresses = {
  [Network.Mainnet]: {
    base: {
      merkleDistributorV2: '0xa9dc250dF4EE9273D09CFa455da41FB1cAC78d34',
    },
    cow: {
      vaultRelayer: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
      nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  },
  [Network.Hoodi]: {
    base: {
      merkleDistributorV2: '0xc61847D6Fc1F64162fF9F1d06205D9c4cDb2f239',
    },
    cow: {
      vaultRelayer: ZeroAddress,
      nativeToken: ZeroAddress,
    },
  },
  [Network.Gnosis]: {
    base: {
      merkleDistributorV2: '0xFBceefdBB0ca25a4043b35EF49C2810425243710',
    },
    cow: {
      vaultRelayer: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
      nativeToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  },
}


export default addresses
