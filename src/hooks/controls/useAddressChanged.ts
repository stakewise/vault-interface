import { useEffect, useRef } from 'react'
import { useConfig } from 'config'


const useAddressChanged = (): boolean => {
  const { address } = useConfig()

  const ref = useRef<string | null>(address)

  useEffect(() => {
    ref.current = address
  }, [ address ])

  return address !== ref.current
}


export default useAddressChanged
