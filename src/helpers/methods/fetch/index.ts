import { AbortRequest } from 'sdk'

import handleJson from './handleJson'
import getRequestUrl from './getRequestUrl'
import extractOpName from './extractOpName'
import saveErrorUrlToSessionStorage from './saveErrorUrlToSessionStorage'


type FetchOptions = RequestInit & {
  retryCount?: number
}

const fetchMethod = async <T = any>(
  urls: string | readonly string[],
  options: FetchOptions = {}
): Promise<T> => {
  const retryCount = options.retryCount ?? 0
  const baseUrl    = getRequestUrl(urls)
  const opName     = extractOpName(options.body)
  const sep        = baseUrl.includes('?') ? '&' : '?'
  const urlToUse   = opName
    ? `${baseUrl}${sep}opName=${encodeURIComponent(opName)}`
    : baseUrl

  if (/^\/api/.test(baseUrl)) {
    options.headers = {
      'cache-control': 'no-store',
      ...(options.headers || {})
    }
  }

  const rawFetch = (): Promise<any> => {
    if (typeof window !== 'undefined') {
      return new Promise<any>((resolve, reject) => {
        const req = new AbortRequest<any>(urlToUse, options)

        req.then(resolve, reject)
      })
    }

    return require('node-fetch').default(urlToUse, options)
  }


  try {
    const response = await rawFetch()

    if ('ok' in response) {
      if (!response.ok) {
        const errJson = await response.json()

        return Promise.reject(errJson)
      }

      return handleJson<T>(await response.json())
    }

    return handleJson<T>(response)
  }
  catch (err: any) {
    if (Array.isArray(urls) && urls.length > 1 && retryCount < 1) {
      saveErrorUrlToSessionStorage(baseUrl)

      return fetchMethod<T>(urls, { ...options, retryCount: retryCount + 1 })
    }

    return Promise.reject(err)
  }
}


export default fetchMethod
