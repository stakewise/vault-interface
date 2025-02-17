import { useEffect } from 'react'

import useChainChanged from './useChainChanged'
import useAddressChanged from './useAddressChanged'


type Input = {
  open?: boolean
  closeModal: () => void
}

const useModalClose = (values: Input) => {
  const { open = true, closeModal } = values

  const isChangedChainId = useChainChanged()
  const isChangedAddress = useAddressChanged()

  useEffect(() => {
    if (isChangedChainId || isChangedAddress || !open) {
      closeModal()
    }
  }, [ isChangedChainId, open, isChangedAddress, closeModal ])
}


export default useModalClose
