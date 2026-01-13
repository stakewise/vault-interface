import time, { Dayjs } from 'dayjs'

import useTime from './useTime'

import { initPlugins } from './plugins'
import './locales'


initPlugins()

declare global {

  namespace Date {

    type Time = Dayjs
  }
}


export default {
  time,
  useTime,
}
