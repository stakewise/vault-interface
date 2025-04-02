import * as constants from 'sw-helpers/constants'
import { getCookie } from 'helpers/_SSR'


const getLocale = (): Intl.LanguagesKeys => {
  const localeCookie = getCookie(constants.cookieNames.language)?.value || 'en'

  return localeCookie as Intl.LanguagesKeys
}


export default getLocale
