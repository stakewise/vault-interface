import getVaultAddress from './getVaultAddress'


const networks: NetworkIds[] = [ 'mainnet', 'gnosis', 'chiado', 'hoodi' ]

const getDefaultNetwork = () => networks.find(getVaultAddress)


export default getDefaultNetwork
