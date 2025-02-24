import React from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'
import { useSwiperSlide } from 'swiper/react'
import Image, { StaticImageData } from 'next/image'

import { Href, Text } from 'components'

import Arrows from './Arrows/Arrows'

import s from './Content.module.scss'


type ContentProps = {
  image?: StaticImageData
  text?: Intl.Message
}

const Content: React.FC<ContentProps> = (props) => {
  const { image, text } = props

  const slide = useSwiperSlide()
  const { isDesktop } = device.useData()

  const withHref = Boolean(text?.values?.url)

  return (
    <div className={cx('w-full text-center', { 'opacity-0': !slide?.isActive })}>
      {
        Boolean(image) ? (
          <div className="relative">
            <Image
              className={s.image}
              height={(image as StaticImageData).height}
              width={(image as StaticImageData).width}
              src={(image as StaticImageData).src}
              alt=""
            />
            <Arrows />
          </div>
        ) : (
          <Arrows
            prevClassName={isDesktop ? undefined : s.bottomPosition}
            nextClassName={isDesktop ? undefined : s.bottomPosition}
          />
        )
      }
      {
        Boolean(text) && (
          <div
            onTouchMove={(event) => {
              event.stopPropagation()
            }}
          >
            <Text
              className={cx('py-24 px-12', {
                'min-h-[88rem]': isDesktop,
              })}
              message={text as Intl.Message}
              color="moon"
              size="t14m"
              HrefComponent={withHref ? Href : undefined}
              html={withHref}
            />
          </div>
        )
      }
    </div>
  )
}


export default React.memo(Content)
