import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import device from 'modules/device'
import intl from 'modules/intl'


type Input = {
  gap?: number
  index: number
  firstRenderClassName?: string
}

const useTabButton = (props: Input, deps: any[] = []) => {
  const { gap = 0, index = 0, firstRenderClassName } = props || {}

  const { locale } = intl.useIntl()
  const { isDesktop } = device.useData()

  const tabButtonRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getPosition = useCallback((index: number) => {
    if (containerRef.current) {
      const buttons = Array.from(containerRef.current.children) as HTMLButtonElement[]
      const sizes = buttons.map((button) => button.getBoundingClientRect())
      const widths = sizes.map(({ width }) => width)
      const height = sizes.reduce((acc, { height }) => Math.max(acc, height), 0)

      const offset = widths
        .filter((_, widthIndex) => widthIndex < index)
        .reduce((acc, width) => acc + width, 0)

      const gapOffset = gap * index

      if (widths[index] && height) {
        return {
          left: `calc(${offset}px + ${gapOffset}rem)`,
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
  }, [ ...deps, locale, isDesktop, setPosition ])

  useEffect(() => {
    const children = containerRef.current?.children

    if (children && firstRenderClassName) {
      Array.from(children).forEach((button) => {
        if (button !== tabButtonRef.current) {
          const classNames = firstRenderClassName.split(' ')

          button.classList.remove(...classNames)
        }
      })
    }
  }, [ firstRenderClassName, ...deps ])

  return useMemo(() => ({
    tabButtonRef,
    containerRef,
  }), [])
}


export default useTabButton
