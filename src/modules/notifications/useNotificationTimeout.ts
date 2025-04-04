import { useCallback, useEffect, useRef } from 'react'

import { open } from './manager'


type SetNotificationTimeoutProps = {
  text: Notifications.NotificationProps['text']
  type?: Notifications.NotificationProps['type']
  time?: number
}

const useNotificationTimeout = ({ handlersOnly }: { handlersOnly?: boolean } = {}) => {
  const timeout = useRef<NodeJS.Timeout>()

  const setNotificationTimeout = useCallback(({ text, type = 'info', time }: SetNotificationTimeoutProps) => {
    timeout.current = setTimeout(() => {
      open({ type, text })
    }, time || 10000)
  }, [])

  const clearNotificationTimeout = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
  }, [])

  useEffect(() => {
    if (!handlersOnly) {
      return () => {
        clearNotificationTimeout()
      }
    }
  }, [ clearNotificationTimeout, handlersOnly ])

  return {
    setNotificationTimeout,
    clearNotificationTimeout,
  }
}


export default useNotificationTimeout
