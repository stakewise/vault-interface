import { useEffect } from 'react'
import { useConfig } from 'config'


type Input = {
  open?: boolean
  closeModal: () => void
}

const useModalClose = (values: Input) => {
  const { open = true, closeModal } = values

  const { isAddressChanged, isChainChanged } = useConfig()

  useEffect(() => {
    if (isChainChanged || isAddressChanged || !open) {
      closeModal()
    }
  }, [ open, isChainChanged, isAddressChanged, closeModal ])
}


export default useModalClose
