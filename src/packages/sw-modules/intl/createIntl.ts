import formatMessage from './formatMessage'


type Input = {
  locale: Intl.LanguagesKeys
  setLocale: (value: Intl.LanguagesKeys) => void
}

const createIntl = ({ locale, setLocale }: Input): Intl.Data => ({
  locale,
  formatMessage: formatMessage.bind(null, locale),
  setLocale,
})


export default createIntl
