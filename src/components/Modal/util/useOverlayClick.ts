import { useCallback } from 'react'
import { useEventListener } from 'sw-hooks'


type Input = {
  skip?: boolean
  closeModal: () => void
}

const useOverlayClick = ({ skip, closeModal }: Input) => {
  const onKeyDown = useCallback((event: any) => {
    if (!skip && event.code === 'Escape') {
      closeModal()
    }
  }, [ skip, closeModal ])

  const onClick = useCallback((event: any) => {
    if (!skip) {
      const isOverlay = event.target?.dataset?.testid === 'modal-overlay'

      if (isOverlay) {
        closeModal()
      }
    }
  }, [ skip, closeModal ])

  useEventListener('keydown', onKeyDown)
  useEventListener('click', onClick)
}


export default useOverlayClick
