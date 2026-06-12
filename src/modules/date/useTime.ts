'use client'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'

import intl from '../intl'
import { changeLocale } from './locales'


const useTime = () => {
  const { locale } = intl.useIntl()
  const [ dep, setDep ] = useState(0)

  useEffect(() => {
    changeLocale(locale)
      .then(() => setDep((value) => ++value))
  }, [ locale ])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => dayjs.bind({}), [ dep ])
}


export default useTime
