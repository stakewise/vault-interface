import { useConfig } from 'config'

import useChangeEffect from './useChangeEffect'


type Callback = () => any

const useAddressChanged = (callback: Callback) => {
  const { address, autoConnectChecked } = useConfig()

  useChangeEffect<[ string | null, boolean, Callback ]>((prevAddress, prevAutoConnectChecked) => {
    if (prevAutoConnectChecked && prevAddress !== address) {
      callback()
    }
  }, [ address, autoConnectChecked, callback ])
}


export default useAddressChanged
