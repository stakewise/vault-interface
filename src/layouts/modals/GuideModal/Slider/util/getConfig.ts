import { SwiperProps } from 'swiper/react'

import {
  A11y,
  Keyboard,
  EffectFade,
  Navigation,
  Pagination,
} from 'swiper/modules'


type Input = {
  autoHeight: SwiperProps['autoHeight']
}

const getConfig = (values: Partial<SwiperProps>): SwiperProps => ({
  effect: 'fade',
  slidesPerView: 1,
  autoHeight: true,
  allowTouchMove: true,
  centeredSlides: true,
  centerInsufficientSlides: true,
  navigation:{
    enabled: true,
  },
  keyboard:{
    enabled: true,
  },
  pagination: {
    type: 'progressbar',
  },
  a11y: {
    nextSlideMessage: 'Next slide',
    prevSlideMessage: 'Previous slide',
  },
  modules: [
    A11y,
    Keyboard,
    EffectFade,
    Navigation,
    Pagination,
  ],
  ...values,
})


export default getConfig
