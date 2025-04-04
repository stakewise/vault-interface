import dayjs from 'dayjs'


const modules: Record<Intl.LanguagesKeys, () => Promise<any>> = {
  en: () => import('dayjs/locale/en'),
  ru: () => import('dayjs/locale/ru'),
  fr: () => import('dayjs/locale/fr'),
  de: () => import('dayjs/locale/de'),
  es: () => import('dayjs/locale/es'),
  pt: () => import('dayjs/locale/pt'),
  zh: () => import('dayjs/locale/zh'),
}

declare module 'dayjs' {
  function changeLocale(locale: Intl.LanguagesKeys): Promise<any>
}

const changeLocale = (locale: Intl.LanguagesKeys) => {
  return modules[locale]().then(() => dayjs.locale(locale))
}

dayjs.changeLocale = changeLocale
