import React, { useState, useCallback, useEffect } from 'react'

import { subscribe, unsubscribe, close, notifications as initialNotifications } from './manager'


type NotificationProps = {
  id: number
  componentProps: Notifications.Notification['props']
  component: any
}

const Notification: React.FC<NotificationProps> = (props) => {
  const { id, component, componentProps } = props

  const handleClose = useCallback(() => {
    close(id)
  }, [ id ])

  return React.createElement(component, {
    ...componentProps,
    closeNotification: handleClose,
  })
}


type ControllerProps = {
  className?: string
  component: any
}

const Controller: React.FC<ControllerProps> = (props) => {
  const { className, component } = props

  const [ notifications, setNotifications ] = useState<Notifications.Notification[]>(initialNotifications)

  useEffect(() => {
    const openHandler: Notifications.SubscribeHandler = (_, notifications) => {
      setNotifications(notifications)
    }

    const closeHandler: Notifications.SubscribeHandler = (_, notifications) => {
      setNotifications(notifications)
    }

    subscribe('open', openHandler)
    subscribe('close', closeHandler)

    return () => {
      unsubscribe('open', openHandler)
      unsubscribe('close', closeHandler)
    }
  }, [])

  return (
    <div className={className}>
      {
        notifications.map(({ id, props }) => (
          <Notification
            key={id}
            id={id}
            component={component}
            componentProps={props}
          />
        ))
      }
    </div>
  )
}


export default Controller
