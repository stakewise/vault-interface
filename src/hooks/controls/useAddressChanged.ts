import { useEffect, useRef } from 'react'
import { useConfig } from 'config'


const useAddressChanged = (callback: () => any) => {
  const { address, autoConnectChecked } = useConfig()

  const isInitRef = useRef(false)
  const addressRef = useRef<string | null>(address)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!isInitRef.current && autoConnectChecked) {
      addressRef.current = address
      isInitRef.current = true
    }

    if (autoConnectChecked && address !== addressRef.current) {
      callbackRef.current()
      addressRef.current = address
    }
  }, [ address, autoConnectChecked ])
}


export default useAddressChanged
