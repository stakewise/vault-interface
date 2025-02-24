import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import device from 'sw-modules/device'
import intl from 'sw-modules/intl'


type Input = {
  gap?: number
  index: number
}

const useTabButton = (props: Input, deps: any[] = []) => {
  const { gap = 0, index = 0 } = props || {}

  const { locale } = intl.useIntl()
  const { isMobile } = device.useData()

  const tabButtonRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getPosition = useCallback((index: number) => {
    if (containerRef.current) {
      const buttons = Array.from(containerRef.current.children) as HTMLButtonElement[]
      const widths = buttons.map(({ offsetWidth }) => offsetWidth)
      const height = buttons.map(({ offsetHeight }) => offsetHeight).reduce((acc, height) => Math.max(acc, height), 0)

      const offset = widths
        .filter((_, widthIndex) => widthIndex < index)
        .reduce((acc, width) => acc + width + gap, 0)

      if (widths[index] && height) {
        return {
          left: `${offset}px`,
          width: `${widths[index]}px`,
          height: `${height}px`,
        }
      }
    }
  }, [ gap ])

  const setPosition = useCallback((count: number = 0) => {
    const style = getPosition(index)

    if (!style && count < 10) {
      setTimeout(() => setPosition(count + 1))
    }

    if (style && tabButtonRef.current) {
      const isFirstRender = !tabButtonRef.current.style.left

      if (isFirstRender) {
        tabButtonRef.current.style.transitionDuration = '0s'

        setTimeout(() => {
          if (tabButtonRef.current) {
            tabButtonRef.current.style.transitionDuration = ''
          }
        })
      }

      tabButtonRef.current.style.left = style.left
      tabButtonRef.current.style.width = style.width
      tabButtonRef.current.style.height = style.height
    }
  }, [ index, getPosition ])

  useLayoutEffect(() => {
    setPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ...deps, locale, isMobile, setPosition ])

  return useMemo(() => ({
    tabButtonRef,
    containerRef,
  }), [])
}


export default useTabButton
