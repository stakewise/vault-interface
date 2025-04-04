import getVaultAddress from './getVaultAddress'


const networks: NetworkIds[] = [ 'mainnet', 'gnosis', 'chiado' ]

const getDefaultNetwork = () => networks.find(getVaultAddress)


export default getDefaultNetwork
