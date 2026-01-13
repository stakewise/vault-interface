import { useCallback } from 'react'
import { useConfig } from 'config'
import { VoidSigner, ZeroAddress } from 'ethers'


const useSigner = () => {
  const { signSDK, address, isReadOnlyMode } = useConfig()

  return useCallback(() => (
    address && !isReadOnlyMode
      ? signSDK.provider.getSigner()
      : new VoidSigner(ZeroAddress, signSDK.provider)
  ), [ signSDK, address, isReadOnlyMode ])
}


export default useSigner
