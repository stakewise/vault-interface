const vaultAddresses = {
  mainnet: process.env.NEXT_PUBLIC_MAINNET_VAULT_ADDRESS || '',
  gnosis: process.env.NEXT_PUBLIC_GNOSIS_VAULT_ADDRESS || '',
  chiado: process.env.NEXT_PUBLIC_CHIADO_VAULT_ADDRESS || '',
}

const getVaultAddress = (networkId: NetworkIds) => vaultAddresses[networkId]


export default getVaultAddress
