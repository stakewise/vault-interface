import getVaultAddress from './getVaultAddress'


const networks: NetworkIds[] = [ 'mainnet', 'gnosis', 'holesky', 'chiado' ]

const getDefaultNetwork = () => networks.find(getVaultAddress)


export default getDefaultNetwork
