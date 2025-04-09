import React, { useState } from 'react'
import cx from 'classnames'
import device from 'modules/device'
import {
  flip,
  shift,
  offset,
  safePolygon,
  useHover,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react'

import ButtonBase from '../ButtonBase/ButtonBase'
import Icon from '../Icon/Icon'

import s from './PopupInfo.module.scss'
import messages from './messages'


export type PopupInfoProps = {
  className?: string
  buttonClassName?: string
  childClassName?: string
  children: React.ReactNode
  headNode: React.ReactNode
}

const PopupInfo: React.FC<PopupInfoProps> = (props) => {
  const { className, buttonClassName, childClassName, headNode, children } = props

  const { isMobile } = device.useData()
  const [ isOpen, setIsOpen ] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: isMobile ? 'top' : 'top-end',
    middleware: [
      offset(10),
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 6,
      }),
      shift({
        padding: 6,
      }),
    ],
    onOpenChange: setIsOpen,
  })

  const hover = useHover(context, {
    handleClose: safePolygon(),
  })

  const { styles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      transform: 'scale(0)',
    },
    open: {
      opacity: 1,
      transform: 'scale(1)',
    },
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([ hover ])

  return (
    <div className={cx(className, 'relative')}>
      <div
        className={cx(buttonClassName, 'cursor-pointer')}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {headNode}
      </div>
      {
        isOpen && (
          <div
            className="z-10"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div
              className={cx(
                s.wrapper,
                childClassName,
                'shadow-md bg-background p-24 rounded-8 border border-dark/10'
              )}
              style={styles}
            >
              <div className={cx(s.container, 'w-full text-start')}>
                {children}
              </div>
              {
                isMobile && (
                  <ButtonBase
                    className="absolute -top-40 right-0 rounded-full bg-background p-4 border border-dark/10"
                    ariaLabel={messages.closePopup}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon
                      name="icon/close"
                      size={24}
                    />
                  </ButtonBase>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}


export default React.memo(PopupInfo)
