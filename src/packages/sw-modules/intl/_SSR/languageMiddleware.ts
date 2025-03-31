import { NextRequest } from 'next/server'
import * as constants from 'sw-helpers/constants'
import { allLanguages } from 'scripts/collectMessages/languages'


const defaultLanguage = allLanguages[0]

const _getServerLanguage = (request: NextRequest) => {
  try {
    const queryLanguage = request.nextUrl.searchParams.get(constants.queryNames.language) || ''

    if (allLanguages.includes(queryLanguage?.toLowerCase() as Intl.LanguagesKeys)) {
      return queryLanguage.toLowerCase()
    }

    const savedLanguage = request.cookies.get(constants.cookieNames.language)?.value || ''

    if (allLanguages.includes(savedLanguage as Intl.LanguagesKeys)) {
      return savedLanguage
    }
    else if (savedLanguage) {
      return defaultLanguage
    }

    const acceptLanguageHeader = request.headers.get('accept-language') || ''
    const languages = acceptLanguageHeader.split(',')

    const languagePreferences = languages.map(lang => {
      const [ language, priority ] = lang.trim().split('q=')

      return {
        priority: priority ? parseFloat(priority) : 1.0,
        language: language.trim().toLowerCase().replace(/-.*$/, ''),
      }
    })

    languagePreferences.sort((a, b) => b.priority - a.priority)

    const clientLanguage = languagePreferences?.[0]?.language as Intl.LanguagesKeys

    let result = defaultLanguage as Intl.LanguagesKeys

    if (clientLanguage && allLanguages.includes(clientLanguage)) {
      result = clientLanguage
    }

    return result
  }
  catch (error) {
    console.error(error)

    return defaultLanguage
  }
}

const languageMiddleware = (request: NextRequest) => {
  const language = _getServerLanguage(request)

  return {
    value: language,
    name: constants.cookieNames.language,
  }
}


export default languageMiddleware
