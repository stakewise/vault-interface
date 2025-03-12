import time from 'dayjs'

import useTime from './useTime'

import { initPlugins } from './plugins'
import './locales'


initPlugins()

declare global {

  namespace Date {

    type Time = ReturnType<typeof useTime>
  }
}


export default {
  time,
  useTime,
}
