import useChainChanged from './useChainChanged'
import useAddressChanged from './useAddressChanged'


type Input = {
  closeModal: () => void
}

const useModalClose = (values: Input) => {
  const { closeModal } = values

  useChainChanged(closeModal)
  useAddressChanged(closeModal)
}


export default useModalClose
