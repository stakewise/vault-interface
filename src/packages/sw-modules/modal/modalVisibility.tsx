import React, { useCallback } from 'react'

import useModalVisibility from './useModalVisibility'
import { closeModal } from './manager'


const checkSameProps = (modalName: string, componentProps = {}, actionProps = {}) => {
  const samePropKeys: string[] = []

  Object.keys(componentProps).forEach((componentPropKey) => {
    if (componentPropKey in actionProps) {
      samePropKeys.push(componentPropKey)
    }
  })

  if (samePropKeys.length) {
    console.warn('Same prop keys used in Component and openModal', {
      extra: {
        modalName,
        samePropKeys,
      },
    })
  }
}

const modalVisibility = <Props extends { [prop: string]: any }>(
  modalName: string,
  ModalComponent: Modals.ModalComponent<Props>
) => {
  const WrappedComponent: Modals.WrappedComponent<Props> = (componentProps) => {
    const { isVisible, props: actionProps } = useModalVisibility<Props>(modalName)

    const { onClose: componentOnClose } = componentProps as Partial<Props>
    const { onClose: actionOnClose } = (actionProps || {}) as Props

    const onClose = actionOnClose || componentOnClose

    checkSameProps(modalName, componentProps, actionProps)

    const handleCloseModal = useCallback(() => {
      closeModal(modalName)

      if (typeof onClose === 'function') {
        onClose()
      }
    }, [ onClose ])

    if (isVisible) {
      return (
        // @ts-ignore (need to reset component props for use them in openModal handler)
        <ModalComponent
          {...componentProps}
          {...actionProps}
          closeModal={handleCloseModal}
        />
      )
    }

    return null
  }

  WrappedComponent.displayName = `modalVisibility(${ModalComponent.displayName || ModalComponent.name})`

  return React.memo(WrappedComponent)
}


export default modalVisibility
