import { useConfig } from 'config'

import useChangeEffect from './useChangeEffect'


type Address = string | null
type Callback = (address: Address) => any

const useAddressChanged = (callback: Callback) => {
  const { address, autoConnectChecked } = useConfig()

  useChangeEffect<[ Address, boolean, Callback ]>((prevAddress, prevAutoConnectChecked) => {
    if (prevAutoConnectChecked && prevAddress !== address) {
      callback(address)
    }
  }, [ address, autoConnectChecked, callback ])
}


export default useAddressChanged
