import { useCallback, useState } from 'react'
import * as constants from 'helpers/constants'
import cookie from 'helpers/cookie'


export type Input = {
  locale?: Intl.LanguagesKeys
  locales: Intl.LanguagesKeys[]
  onSetLocale?: (locale: Intl.LanguagesKeys) => void
}

type Output = {
  locale: Intl.LanguagesKeys
  setLocale: (locale: Intl.LanguagesKeys) => void
}

const useLocale = (values: Input): Output => {
  const {
    locale,
    locales = [],
    onSetLocale,
  } = values

  // The module can take control of any kind of router, or we can save locale in state (if control via a router is not suitable for us)
  const [ runtimeLocale, setRuntimeLocale ] = useState<Intl.LanguagesKeys>(locale || 'en')

  const setLocale = useCallback((value: Intl.LanguagesKeys) => {
    const isValid = locales.includes(value)

    if (!isValid) {
      console.error(`${value} translation is not supported`)

      return
    }

    setRuntimeLocale(value)

    cookie.set(constants.cookieNames.language, value)

    if (typeof onSetLocale === 'function') {
      onSetLocale(value)
    }
  }, [ locales, onSetLocale ])

  return {
    locale: runtimeLocale,
    setLocale,
  }
}


export default useLocale
