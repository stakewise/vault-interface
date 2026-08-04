import { useCallback } from 'react'
import { useEventListener } from 'hooks'


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

  const onMousedown = useCallback((event: any) => {
    if (!skip) {
      const isOverlay = event.target?.dataset?.testid === 'modal-overlay'

      if (isOverlay) {
        closeModal()
      }
    }
  }, [ skip, closeModal ])

  useEventListener('keydown', onKeyDown)
  useEventListener('mousedown', onMousedown)
}


export default useOverlayClick
