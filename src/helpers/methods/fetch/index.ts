import { AbortRequest } from 'sdk'

import { sessionStorageNames } from '../../constants'

import {
  handleJson,
  extractOpName,
  getRequestUrl,
  saveErrorUrlToSessionStorage,
} from './utils'


type FetchOptions = RequestInit & {
  retryCount?: number
}

const sessionErrorUrl = sessionStorageNames.moduleErrorUrl

const fetchMethod = <T = any>(
  urls: string | readonly string[],
  options: FetchOptions = {}
): AbortRequest<T, T> => {
  const retryCount = options.retryCount ?? 0
  const baseUrl = getRequestUrl({ urls, sessionErrorUrl })
  const opName = extractOpName(options.body)
  const sep = baseUrl.includes('?') ? '&' : '?'
  const urlToUse = opName
    ? `${baseUrl}${sep}opName=${encodeURIComponent(opName)}`
    : baseUrl

  if (/^\/api/.test(baseUrl)) {
    options.headers = {
      'cache-control': 'no-store',
      ...(options.headers || {}),
    }
  }

  const req = new AbortRequest<T>(urlToUse, options)

  if (typeof window === 'undefined') {
    const nodePromise: Promise<T> = require('node-fetch')
      .default(urlToUse, options)
      .then((res: any) => res.json())
      .then(handleJson)

    // @ts-ignore
    req.promise = nodePromise
  }
  else {
    // @ts-ignore
    req.promise = req.promise
      .then((res: any) => {
        if (res instanceof Response) {
          if (!res.ok) {
            return res.json().then(errJson => Promise.reject(errJson))
          }

          return res.json()
        }

        return Promise.resolve(res)
      })
      .then(handleJson)
      .catch((err: any) => {
        const hasBackup = Array.isArray(urls) && urls.length > 1

        if (hasBackup && retryCount < 1) {
          saveErrorUrlToSessionStorage({ baseUrl, sessionErrorUrl })

          return fetchMethod<T>(urls, { ...options, retryCount: retryCount + 1 }).promise
        }

        return Promise.reject(err)
      })
  }

  return req
}


export default fetchMethod
