import React, { useCallback } from 'react'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import device from 'modules/device'
import cx from 'classnames'

import { RoundButton } from 'components'

import s from './Arrows.module.scss'
import messages from './messages'


type ArrowsProps = {
  className?: string
  prevClassName?: string
  nextClassName?: string
}

const Arrows: React.FC<ArrowsProps> = (props) => {
  const { className, prevClassName, nextClassName } = props

  const swiper = useSwiper()
  const slide = useSwiperSlide()
  const { isMobile } = device.useData()

  const handlePrev = useCallback(() => swiper?.slidePrev(), [ swiper ])
  const handleNext = useCallback(() => swiper?.slideNext(), [ swiper ])

  if (!slide?.isActive) {
    return null
  }

  return (
    <div className={cx(className, s.container)}>
      <RoundButton
        className={cx(s.arrow, s.prev, prevClassName, 'absolute')}
        ariaLabel={messages.prevSlide}
        disabled={!swiper?.activeIndex}
        size={isMobile ? 24 : 48}
        icon="arrow/left"
        iconColor="light"
        color="dark"
        onClick={handlePrev}
      />
      <RoundButton
        className={cx(s.arrow, s.next, nextClassName, 'absolute')}
        ariaLabel={messages.nextSlide}
        disabled={swiper?.slides?.length - 1 === swiper?.activeIndex}
        size={isMobile ? 24 : 48}
        icon="arrow/right"
        iconColor="light"
        color="dark"
        onClick={handleNext}
      />
    </div>
  )
}


export default React.memo(Arrows)
