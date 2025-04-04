import replaceSimpleVariables from './util/replaceSimpleVariables'
import replacePluralVariables from './util/replacePluralVariables'
import replaceSelectVariables from './util/replaceSelectVariables'
import stripSpaces from './util/stripSpaces'


const formatMessage = (locale: string = 'en', message: Intl.MessageTranslation, values?: Intl.MessageValues) => {
  if (typeof message === 'string') {
    return message
  }

  const localeMessage = message?.[locale as keyof Intl.MessageTranslation]

  let fMessage

  if (!localeMessage) {
    if (!message.en) {
      console.error(`Intl error: missed translation`, message)
      return '{{ missed_translation }}'
    }

    console.error(`Intl error: no value for locale: ${locale}`, message)
    fMessage = stripSpaces(String(message.en))
  }
  else {
    fMessage = stripSpaces(String(localeMessage))
  }

  fMessage = replaceSelectVariables(fMessage, values)
  fMessage = replacePluralVariables(fMessage, locale, values)
  fMessage = replaceSimpleVariables(fMessage, values)

  return fMessage || '{{ missed_translation }}'
}


export default formatMessage
