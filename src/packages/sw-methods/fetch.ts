import { AbortRequest } from 'apps/v3-sdk'


const fetchMethod = <T = any>(url: string, options: RequestInit = {}): AbortRequest<T, T> => {
  const isApi = /^\/api/.test(url)

  options.headers = {
    ...options?.headers,
    'content-type': 'application/json',
  }

  if (isApi) {
    options.headers = {
      'cache-control': 'no-store',
      ...options?.headers,
    }
  }

  if (typeof window !== 'undefined') {
    return new AbortRequest<T>(url, options)
  }

  const nodeFetch = require('node-fetch').default

  return nodeFetch(url, options)
    .then((response: Response) => response.json())
}


export default fetchMethod
