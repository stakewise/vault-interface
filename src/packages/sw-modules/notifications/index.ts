'use client'
declare global {

  namespace Notifications {

    type Event = 'open' | 'close'

    type Notification = {
      id: number
      thread?: string
      props: Omit<NotificationProps, 'closeNotification'>
    }

    type NotificationProps = {
      text: Intl.Message | string
      type: 'error' | 'success' | 'info' | 'warning'
      closeNotification: CloseNotification
    }

    type OpenNotificationProps = Omit<NotificationProps, 'closeNotification'> & {
      thread?: string
    }

    type CloseNotification = (id: number) => void
    type Subscribe = (event: Event, handler: SubscribeHandler) => void
    type Unsubscribe = (event: Event, handler: SubscribeHandler) => void
    type OpenNotification = (props: OpenNotificationProps) => void
    type SubscribeHandler = (notification: Notification, notifications: Notification[]) => void
  }
}


import { subscribe, unsubscribe, open, close, closeAll } from './manager'
import useNotificationTimeout from './useNotificationTimeout'
import Controller from './Controller'


export default {
  Controller,
  useNotificationTimeout,
  unsubscribe,
  subscribe,
  closeAll,
  close,
  open,
}
