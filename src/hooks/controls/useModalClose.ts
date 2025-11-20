import { useEffect } from 'react'
import { useConfig } from 'config'


type Input = {
  closeModal: () => void
}

const useModalClose = (values: Input) => {
  const { closeModal } = values

  const { wallet } = useConfig()

  useEffect(() => {
    wallet.subscribeBeforeChange('chain', closeModal)
    wallet.subscribeBeforeChange('address', closeModal)
    return () => {
      wallet.unsubscribeBeforeChange('chain', closeModal)
      wallet.unsubscribeBeforeChange('address', closeModal)
    }
  }, [])
}


export default useModalClose
