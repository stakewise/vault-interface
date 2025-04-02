import React, { useRef } from 'react'
import { useIsomorphicLayoutEffect  } from 'hooks'
import cx from 'classnames'

import s from './AutoHeightToggle.module.scss'


export type AutoHeightToggleProps = {
  className?: string
  contentClassName?: string
  children: React.ReactNode
  toggleContent?: React.ReactNode
  padding?: number
  isOpen: boolean
  dataTestId?: string
}

const AutoHeightToggle: React.FC<AutoHeightToggleProps> = (props) => {
  const { className, children, toggleContent, contentClassName, isOpen, padding = 12, dataTestId } = props

  const contentRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const isInit = containerRef.current && contentRef.current && childrenRef.current

    if (!isInit) {
      return
    }

    if (isOpen) {
      const contentHeight = contentRef.current.clientHeight
      const containerHeight = childrenRef.current.clientHeight
      const marginTop = parseFloat(getComputedStyle(contentRef.current).marginTop)

      containerRef.current.style.height = `calc(${padding * 2}rem + ${contentHeight + containerHeight + marginTop}px)`
    }
    else {
      const height = childrenRef.current.clientHeight

      containerRef.current.style.height = `calc(${padding * 2}rem + ${height}px)`
    }
  }, [ isOpen, toggleContent ])

  const containerClassName = cx(className, s.container, `p-${padding} relative`)

  const toggleContentClassName = cx(contentClassName, s.content, {
    [s.open]: isOpen,
    [s.close]: !isOpen,
  })

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      data-testid={dataTestId}
    >
      <div ref={childrenRef}>
        {children}
      </div>
      {
        Boolean(toggleContent) && (
          <div className={toggleContentClassName} ref={contentRef}>
            {toggleContent}
          </div>
        )
      }
    </div>
  )
}


export default React.memo(AutoHeightToggle)
