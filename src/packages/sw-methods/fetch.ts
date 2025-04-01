import { AbortRequest } from 'sdk'


const fetchMethod = <T = any>(url: string, options: RequestInit = {}): AbortRequest<T, T> => {
  const isApi = /^\/api/.test(url)

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
