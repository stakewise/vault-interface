import { IconName, LogoName } from 'components'


export type OptionsType = {
  value: string
  logo?: LogoName
  icon?: IconName
  title: Intl.Message | string
}

const getEnv = (env: string) => (
  env
    .replace(/["']/g, '')
    .split(',')
    .filter(Boolean)
    .map((val) => val.trim().toLowerCase())
)

const enabledLocales = getEnv(process.env.NEXT_PUBLIC_LOCALES || '')
const enabledCurrencies = getEnv(process.env.NEXT_PUBLIC_CURRENCIES || '')

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
let languageOptions: OptionsType[] = [
  //English
  {
    title: 'English',
    value: 'en',
    logo: 'language/en',
  },
  //Deutsch
  {
    title: 'Deutsch',
    value: 'de',
    logo: 'language/de',
  },
  //French
  {
    title: 'Français',
    value: 'fr',
    logo: 'language/fr',
  },
  //Spanish
  {
    title: 'Español',
    value: 'es',
    logo: 'language/es',
  },
  //Portuguese
  {
    title: 'Português',
    value: 'pt',
    logo: 'language/pt',
  },
  //Chinese
  {
    title: '繁體中文',
    value: 'zh',
    logo: 'language/zh',
  },
  //Russian
  {
    title: 'Русский',
    value: 'ru',
    logo: 'language/ru',
  },
]

languageOptions = languageOptions
  .filter(({ value }) => enabledLocales.length ? enabledLocales.includes(value) : true)

let currencyOptions: OptionsType[] = [
  {
    title: 'USD',
    value: 'USD',
    icon: 'currency/usd',
  },
  {
    title: 'EUR',
    value: 'EUR',
    icon: 'currency/eur',
  },
  {
    title: 'GBP',
    value: 'GBP',
    icon: 'currency/gbp',
  },
  {
    title: 'CNY',
    value: 'CNY',
    icon: 'currency/cny',
  },
  {
    title: 'JPY',
    value: 'JPY',
    icon: 'currency/jpy',
  },
  {
    title: 'KRW',
    value: 'KRW',
    icon: 'currency/krw',
  },
  {
    title: 'AUD',
    value: 'AUD',
    icon: 'currency/aud',
  },
]

currencyOptions = currencyOptions
  .filter(({ value }) => enabledCurrencies.length ? enabledCurrencies.includes(value.toLowerCase()) : true)


export {
  languageOptions,
  currencyOptions,
}
