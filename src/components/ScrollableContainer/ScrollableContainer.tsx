import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import observer from 'modules/intersection-observer'

import Icon from '../Icon/Icon'
import Text from '../Text/Text'
import ButtonBase from '../ButtonBase/ButtonBase'

import messages from './messages'


export type ScrollableContainerProps = {
  children: ReactNode
  className?: string
  fadeClassName?: string
  withScrollTop?: boolean
  style?: React.CSSProperties
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = (props) => {
  const { children, className, style, withScrollTop } = props

  const { ref: topRef } = observer.useEntry()
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { ref: bottomRef, isVisible: isBottomVisible } = observer.useEntry()
  const [ isScrollTopVisible, setScrollTopVisible ] = useState(false)

  const childElement = children as ReactElement<any>

  // eslint-disable-next-line max-len
  const fadeClassName = cx(props.fadeClassName, 'h-32 w-full bg-gradient-to-b from-0% to-100% left-0 z-1 transition-opacity duration-75 pointer-events-none', {
    'absolute': !props.fadeClassName?.includes('fixed'),
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollTopVisible((scrollContainerRef.current?.scrollTop || 0) > 300)
    }

    scrollContainerRef.current?.addEventListener('scroll', handleScroll)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollContainerRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={containerRef} className={cx(className, 'relative')} style={style}>
      {
        withScrollTop && (
          <div
            className={cx('absolute z-1 top-20 left-0 w-full flex justify-center transition duration-250 pointer-events-none', {
              'opacity-0': !isScrollTopVisible,
            })}
          >
            <ButtonBase
              className="h-24 px-8 rounded-72 bg-primary flex items-center gap-4 pointer-events-auto"
              onClick={() => {
                scrollContainerRef.current?.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }}
            >
              <Icon
                name="icon/scrollUp"
                size={12}
                color="white"
              />
              <Text
                message={messages.buttonTitle}
                size="t12m"
                color="white"
              />
            </ButtonBase>
          </div>
        )
      }
      {
        React.cloneElement<HTMLDivElement>(
          childElement,
          {
            ref: scrollContainerRef,
            ...childElement.props,
          },
          <>
            <div ref={topRef} />
            {childElement.props.children}
            <div ref={bottomRef} />
          </>
        )
      }
      <div
        className={cx(fadeClassName, 'from-background/0 to-background bottom-0', {
          'opacity-0': isBottomVisible,
        })}
      />
    </div>
  )
}


export default React.memo(ScrollableContainer)
