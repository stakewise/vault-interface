import IntlProvider from './IntlProvider'
import useIntlRef from './useIntlRef'
import Message from './Message'
import useIntl from './useIntl'


declare global {

  namespace Intl {

    type MessageValues = {
      [key: string]: string | number | undefined
    }

    type LanguagesKeys = 'en' | 'ru' | 'fr' | 'de' | 'es' | 'pt' | 'zh'

    type MessageTranslation = {
      [key in LanguagesKeys]?: string
    }

    type Message = MessageTranslation & {
      values?: MessageValues
    }

    type Data = {
      locale: LanguagesKeys
      formatMessage: (message: MessageTranslation, values?: MessageValues) => string
      setLocale: (locale: LanguagesKeys) => void
    }
  }
}


export default {
  IntlProvider,
  Message,
  useIntlRef,
  useIntl,
}
