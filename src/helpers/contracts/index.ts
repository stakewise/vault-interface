import { createContract } from 'sdk'

import addresses from './addresses'
import { WrappedToken, MerkleDistributorV2 } from './types'
import { WrappedTokenAbi, MerkleDistributorV2Abi } from './abis'


type CreateContractsInput = {
  provider: StakeWise.Provider
  config: StakeWise.Config
}

const getMerkleDistributorV2 = ({ provider, config }: CreateContractsInput) => createContract<MerkleDistributorV2>(
  addresses[config.network.chainId].base.merkleDistributorV2,
  MerkleDistributorV2Abi,
  provider
)

export const createContracts = (input: CreateContractsInput) => ({
  base: {
    merkleDistributorV2: getMerkleDistributorV2(input),
  },
  helpers: {
    createWrappedToken: (address: string) => createContract<WrappedToken>(address, WrappedTokenAbi, input.provider),
  },
})


export default createContracts
