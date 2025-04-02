import React, { useMemo } from 'react'

import IntlContext from './IntlContext'
import createIntl from './createIntl'
import useLocale from './useLocale'
import type { Input as UseLocaleInput } from './useLocale'


type IntlProviderProps = UseLocaleInput & {
  children: React.ReactNode
}

const IntlProvider: React.FC<IntlProviderProps> = (props) => {
  const { children, ...rest } = props

  const { locale, setLocale } = useLocale(rest)

  const intl = useMemo(() => createIntl({ locale, setLocale }), [ locale, setLocale ])

  return (
    <IntlContext.Provider value={intl}>
      {children}
    </IntlContext.Provider>
  )
}


export default IntlProvider
