import * as constants from 'helpers/constants'
import { getCookie } from 'helpers/_SSR'


const getLocale = async (): Promise<Intl.LanguagesKeys> => {
  const result = await getCookie(constants.cookieNames.language)

  return (result?.value || 'en') as Intl.LanguagesKeys
}


export default getLocale
