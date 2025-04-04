const getEnv = (env) => (
  env
    .replace(/["']/g, '')
    .split(',')
    .filter(Boolean)
    .map((val) => val.trim().toLowerCase())
)

const availableLocales = getEnv(process.env.NEXT_PUBLIC_LOCALES || '')

const allLanguages = [
  'en', // English
  'ru', // Russian
  'fr', // French
  'es', // Spanish
  'pt', // Portuguese
  'de', // Deutsch
  'zh', // Chinese
]
  .filter((locale) => (
    availableLocales.length ? availableLocales.includes(locale) : true
  ))


export {
  allLanguages,
}
