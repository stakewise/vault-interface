import { Network } from 'sdk'
import { ZeroAddress } from 'ethers'


const addresses = {
  [Network.Mainnet]: {
    aave: {
      poolAddressProvider: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
      poolDataProvider: '0x5c5228aC8BC1528482514aF3e27E692495148717',
    },
    balancer: {
      vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    },
    base: {
      oracles: '0x2f1C5E86B13a74f5A6E7B4b35DD77fe29Aa47514',
      merkleDistributor: '0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20',
      merkleDistributorV2: '0xa9dc250dF4EE9273D09CFa455da41FB1cAC78d34',
    },
  },
  [Network.Holesky]: {
    aave: {
      poolAddressProvider: ZeroAddress,
      poolDataProvider: ZeroAddress,
    },
    balancer: {
      vault: ZeroAddress,
    },
    base: {
      oracles: ZeroAddress,
      merkleDistributor: ZeroAddress,
      merkleDistributorV2: '0xC8Eb13a2F1799Fd7Eb1cE7393259962EE2cd6514',
    },
  },
  [Network.Gnosis]: {
    aave: {
      poolAddressProvider: ZeroAddress,
      poolDataProvider: ZeroAddress,
    },
    balancer: {
      vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    },
    base: {
      oracles: '0xa6D123620Ea004cc5158b0ec260E934bd45C78c1',
      merkleDistributor: '0x7dc30953CE236665d032329F6a922d67F0a33a2B',
      merkleDistributorV2: '0xFBceefdBB0ca25a4043b35EF49C2810425243710',
    },
  },
  [Network.Chiado]: {
    aave: {
      poolAddressProvider: ZeroAddress,
      poolDataProvider: ZeroAddress,
    },
    balancer: {
      vault: ZeroAddress,
    },
    base: {
      oracles: ZeroAddress,
      merkleDistributor: ZeroAddress,
      merkleDistributorV2: '0xd0747320d5457256D0203dfe61209Afbb90d22D7',
    },
  },
}


export default addresses
