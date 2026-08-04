import React, { useRef, useEffect, useCallback, useState, Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import device from 'modules/device'
import cx from 'classnames'

import Form from '../Form/Form'

import { useOverlayClick } from './util'
import Content, { ContentProps } from './Content/Content'

import s from './Modal.module.scss'


export type ModalProps = Omit<ContentProps, 'handleClose'> & {
  className?: string
  withForm?: boolean
  isOverlayDisabled?: boolean
  ref?: React.RefObject<HTMLDivElement | null>
  closeModal: Modals.VisibilityProps['closeModal'] | null
}

const Modal: React.FC<ModalProps> = (props) => {
  const {
    children, title, subTitle, description, dataTestId, size = 'wide', ref,
    primaryButton, secondaryButton, bottomNode, className, contentClassName, withForm,
    isOverlayDisabled, isCloseButtonDisabled, customPrimaryButton, closeModal, onBackButtonClick,
  } = props

  // This state use for animation
  const [ isOpen, setIsOpen ] = useState(true)

  const { isDesktop, isMobile } = device.useData()

  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleFocusOut = () => {
      setTimeout(() => {
        if (document.activeElement === document.body) {
          panelRef.current?.focus()
        }
      })
    }

    setTimeout(() => panelRef.current?.focus())

    document.addEventListener('focusout', handleFocusOut)

    return () => {
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  useEffect(() => {
    // Headless UI Dialog sets the #global-wrapper to inert,
    // which prevents users from clicking the close button on notifications.
    // To resolve this issue, we remove the inert property when the modal is opened
    setTimeout(() => {
      const root = document.getElementById('global-wrapper')

      if (root) {
        root.inert = false
        root.ariaHidden = null
      }
    })

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = useCallback(() => {
    if (typeof closeModal === 'function') {
      setIsOpen(false)
      setTimeout(closeModal, 400) // for animation
    }
  }, [ closeModal ])

  useOverlayClick({
    closeModal: handleClose,
    skip: isOverlayDisabled,
  })

  const content = (
    <Content
      size={size}
      title={title}
      subTitle={subTitle}
      bottomNode={bottomNode}
      dataTestId={dataTestId}
      description={description}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      contentClassName={contentClassName}
      customPrimaryButton={customPrimaryButton}
      isCloseButtonDisabled={isCloseButtonDisabled}
      onBackButtonClick={onBackButtonClick}
      handleClose={handleClose}
    >
      {children}
    </Content>
  )

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className="relative z-modal"
        open
        onClose={() => {}}
      >
        <TransitionChild
          as={Fragment}
          enter={s.modalEnter}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave={s.modalLeave}
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={cx(s.overlay, 'fixed left-0 right-0 top-0 bottom-0')} />
        </TransitionChild>
        <div
          ref={ref}
          className={cx('fixed top-0 left-0 w-full h-full grid overflow-y-auto', {
            'py-24': isDesktop,
          })}
          data-testid="modal-overlay"
        >
          <TransitionChild
            as={Fragment}
            enter={s.modalEnter}
            enterFrom={s.modalFrom}
            enterTo={s.modalTo}
            leave={s.modalLeave}
            leaveFrom={s.modalTo}
            leaveTo={s.modalFrom}
          >
            <DialogPanel
              ref={panelRef}
              tabIndex={-1}
              className={cx(className, s.modal, 'relative m-auto p-24 bg-modal', s[size], {
                'rounded-16': !isMobile,
                'flex flex-col': isMobile,
              })}
              data-testid={dataTestId}
            >
              {
                withForm ? (
                  <Form onSubmit={primaryButton?.onClick}>
                    {content}
                  </Form>
                ) : (
                  content
                )
              }
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

Modal.displayName = 'Modal'


export default React.memo(Modal)
