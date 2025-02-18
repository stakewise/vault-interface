import { commonMessages } from 'helpers'
import { getLocale } from 'sw-modules/intl/_SSR'


export const generateMetadata: GenerateMetadata = async () => {
  const locale = getLocale()

  return {
    title: commonMessages.meta['404'][locale],
  }
}


export { default } from 'views/ErrorView/ErrorView'
