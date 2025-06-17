type FetchFunction = (url: string, options?: RequestInit) => Promise<Response>

type Config = {
  maxRetries?: number
  delay?: number
}

let fetchFunction: FetchFunction

if (typeof window === 'undefined') {
  const nodeFetch = require('node-fetch').default

  fetchFunction = nodeFetch
}
else {
  fetchFunction = fetch
}

const fetchWithRetry = async <T = any>(url: string, options: RequestInit = {}, config: Config = {}): Promise<T> => {
  const maxRetries = config.maxRetries || 3
  const delay = config.delay || 300

  const retryFetch = async (attempt: number): Promise<any> => {
    try {
      const isApi = /^\/api/.test(url)

      if (isApi) {
        options.headers = {
          'cache-control': 'no-store',
          ...options?.headers,
        }
      }

      const response = await fetchFunction(url, options)

      if (!response.ok && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delay))

        return retryFetch(attempt + 1)
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      return data
    }
    catch (error) {
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delay))

        return retryFetch(attempt + 1)
      }

      throw error
    }
  }

  return retryFetch(0)
}


export default fetchWithRetry
