import { useConfig } from 'config'
import { getters } from 'helpers'


const useVaultAddress = () => {
  const { networkId } = useConfig()

  return getters.getVaultAddress(networkId)
}


export default useVaultAddress
