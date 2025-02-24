'use client'
import { useEffect, useRef, useCallback, RefObject } from 'react'


const useEventListener = (
  eventName: string,
  handler: EventListener,
  elementRef?: RefObject<HTMLElement>,
  passive?: boolean
) => {
  const handlerRef = useRef<EventListener | null>(null)

  useEffect(() => {
    handlerRef.current = handler
  }, [ handler ])

  const eventListener = useCallback<EventListener>((event) => {
    if (typeof handlerRef.current === 'function') {
      handlerRef.current(event)
    }
  }, [])

  const removeListener = useCallback(() => {
    const element = elementRef ? elementRef.current : window

    element?.removeEventListener(eventName, eventListener)
  }, [ eventName, elementRef, eventListener ])

  useEffect(() => {
    const element = elementRef ? elementRef.current : window

    if (element && element.addEventListener) {
      element.addEventListener(eventName, eventListener, { passive })

      return () => {
        element.removeEventListener(eventName, eventListener)
      }
    }
  }, [ eventName, elementRef, eventListener, passive ])

  return removeListener
}


export default useEventListener
