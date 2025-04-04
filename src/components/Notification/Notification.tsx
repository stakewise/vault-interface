import React, { useRef, useEffect, useCallback } from 'react'
import 'modules/notifications' // for get types
import cx from 'classnames'

import Icon from '../Icon/Icon'
import Text from '../Text/Text'
import Logo from '../Logo/Logo'
import type { LogoName } from '../Image/Image'
import ButtonBase from '../ButtonBase/ButtonBase'

import s from './Notification.module.scss'
import messages from './messages'


const typesOfLogos = {
  info: 'image/information',
  error: 'image/error',
  success: 'image/success',
}

const Notification: React.FC<Notifications.NotificationProps> = (props) => {
  const { text, type, closeNotification } = props

  const nodeRef = useRef<HTMLDivElement>(null)

  const isError = type === 'error'

  const handleClose = useCallback(() => {
    if (nodeRef.current) {
      nodeRef.current.style.marginTop = `${-1 * nodeRef.current.clientHeight}px`
      nodeRef.current.classList.add(s.closed)
      setTimeout(closeNotification, 300) // For animation
    }
  }, [ closeNotification ])

  useEffect(() => {
    const timer = setTimeout(handleClose, 6000)

    return () => {
      clearTimeout(timer)
    }
  }, [ handleClose ])

  useEffect(() => {
    if (nodeRef.current && isError) {
      nodeRef.current.focus()
    }
  }, [ isError ])

  const notificationClassName = cx(
    s.notification,
    'relative inline-flex items-center rounded-12 px-16 py-8 pr-56 mt-12 relative overflow-hidden',
    s[type]
  )

  const dataTestId = `notification-${type}`

  return (
    <div
      ref={nodeRef}
      className={notificationClassName}
      tabIndex={-1}
      aria-atomic="true"
      data-testid={dataTestId}
      role={isError ? 'alert' : 'status'}
      aria-labelledby={`${dataTestId}-text`}
      aria-live={isError ? 'assertive' : 'polite'}

    >
      <Logo
        className="z-1"
        name={typesOfLogos[type as keyof typeof typesOfLogos] as LogoName}
        size={24}
      />
      <Text
        className="overflow-hidden ml-16 relative"
        id={`${dataTestId}-text`}
        message={text}
        color="dark"
        size="t12m"
        dataTestId={`${dataTestId}-text`}
        html
      />
      <ButtonBase
        className={cx(s.closeButton, 'absolute overflow-hidden rounded-full p-4 z-1')}
        dataTestId={`${dataTestId}-close-button`}
        ariaLabel={messages.closeNotification}
        onClick={handleClose}
      >
        <Icon
          name="icon/close"
          color="dark"
          size={16}
        />
      </ButtonBase>
    </div>
  )
}


export default React.memo(Notification)
