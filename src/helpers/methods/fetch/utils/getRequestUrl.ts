import { localStorage } from 'sdk'

import type { ErrorRecord } from './types'


type Input = {
  sessionErrorUrl: string
  urls: string | ReadonlyArray<string>
}

const getErroredUrlFromSessionStorage = (url: string): string | null => {
  const sessionRecord = localStorage.getSessionItem<ErrorRecord>(url)

  if (!sessionRecord) {
    return null
  }

  if (sessionRecord.expiresAt <= Date.now()) {
    localStorage.removeSessionItem(url)

    return null
  }

  return sessionRecord.url
}

const getRequestUrl = (input: Input): string => {
  const { urls, sessionErrorUrl } = input

  if (typeof urls === 'string') {
    return urls
  }

  if (!urls.length) {
    throw new Error('The array does not contain the url for the query')
  }

  if (urls.length === 1) {
    return urls[0]
  }

  const primary = urls[0]
  const backup  = urls[1]

  const errored = getErroredUrlFromSessionStorage(sessionErrorUrl)

  return errored === primary ? backup : primary
}


export default getRequestUrl
