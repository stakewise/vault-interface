import React, { useCallback, useRef } from 'react'
import { commonMessages } from 'helpers'
import cx from 'classnames'

import { ButtonBase, getImageStyle } from 'components'

import arrowImage from './images/arrow.svg'

import s from './FlipButton.module.scss'


const arrows = [ s.left, s.right ]

const style = getImageStyle({ size: 16, color: 'dark', imageUrl: arrowImage.src })

type FlipButtonProps = {
  className?: string
  onClick?: () => void
}

const FlipButton: React.FC<FlipButtonProps> = (props) => {
  const { className, onClick } = props

  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(() => {
    const isActive = containerRef.current?.classList.contains(s.active)

    if (!isActive) {
      containerRef.current?.classList.add(s.active)

      setTimeout(() => {
        containerRef.current?.classList.remove(s.active)
      }, 800)
    }

    if (typeof onClick === 'function') {
      onClick()
    }
  }, [ onClick ])

  return (
    <ButtonBase
      className={cx(className, 'opacity-50 hover:opacity-100 bg-dark/10 px-12 py-6 rounded-16 h-32')}
      ariaLabel={commonMessages.accessibility.flipStakeTabs}
      dataTestId="flip-tabs"
      onClick={handleClick}
    >
      <div
        ref={containerRef}
        className="w-16 h-16 relative"
      >
        {
          arrows.map((className, index) => (
            <div
              key={index}
              className={cx(className, 'w-16 h-16 absolute top-0 left-0 bg-dark')}
              style={style}
            />
          ))
        }
      </div>
    </ButtonBase>
  )
}


export default React.memo(FlipButton)
