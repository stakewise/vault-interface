import React from 'react'
import cx from 'classnames'
import device from 'modules/device'
import { StaticImageData } from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'

import { getConfig } from './util'
import Content from './Content/Content'
import Controller from './Controller/Controller'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

import s from './Slider.module.scss'


export type SliderProps = {
  items: Array<{
    image?: StaticImageData
    text?: Intl.Message
  }>
}

const Slider: React.FC<SliderProps> = (props) => {
  const { items } = props

  const { isDesktop } = device.useData()

  const config = getConfig({
    autoHeight: isDesktop,
    allowTouchMove: !isDesktop,
  })

  return (
    <div
      className={cx(s.container, 'relative flex-1 h-full', {
        'rounded-12 overflow-hidden': isDesktop,
      })}
    >
      <Swiper {...config}>
        <Controller />
        {
          items.map(({ image, text }, index) => (
            <SwiperSlide key={index}>
              <Content
                text={text}
                image={image}
              />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  )
}


export default React.memo(Slider)
