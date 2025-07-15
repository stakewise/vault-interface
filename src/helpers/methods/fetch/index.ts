import { AbortRequest } from 'sdk'

import handleJson from './handleJson'
import getRequestUrl from './getRequestUrl'
import extractOpName from './extractOpName'
import saveErrorUrlToSessionStorage from './saveErrorUrlToSessionStorage'


type FetchOptions = RequestInit & {
  retryCount?: number
}

const fetchMethod = <T = any>(
  urls: string | readonly string[],
  options: FetchOptions = {}
): AbortRequest<T, T> => {
  const retryCount = options.retryCount ?? 0
  const baseUrl = getRequestUrl(urls)
  const opName = extractOpName(options.body)
  const sep = baseUrl.includes('?') ? '&' : '?'
  const urlToUse = opName
    ? `${baseUrl}${sep}opName=${encodeURIComponent(opName)}`
    : baseUrl

  if (/^\/api/.test(baseUrl)) {
    options.headers = {
      'cache-control': 'no-store',
      ...(options.headers || {})
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
        if ('ok' in res && !res.ok) {
          return res.json()
            .then((errJson: any) => Promise.reject(errJson))
        }

        return ('ok' in res ? res.json() : Promise.resolve(res)) as Promise<any>
      })
      .then(handleJson)
      .catch((err: any) => {
        const hasBackup = Array.isArray(urls) && urls.length > 1

        if (hasBackup && retryCount < 1) {
          saveErrorUrlToSessionStorage(baseUrl)

          return fetchMethod<T>(urls, { ...options, retryCount: retryCount + 1 }).promise
        }

        return Promise.reject(err)
      })
  }

  return req
}


export default fetchMethod
