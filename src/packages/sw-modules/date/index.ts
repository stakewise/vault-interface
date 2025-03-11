import time from 'dayjs'

import useTime from './useTime'

import './plugins'
import './locales'


console.log('date', time)

declare global {

  namespace Date {

    type Time = ReturnType<typeof useTime>
  }
}


export default {
  time,
  useTime,
}
