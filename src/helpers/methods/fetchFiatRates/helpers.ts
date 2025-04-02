import cacheStorage from 'modules/cache-storage'


type Cache = Record<string, any>
type Currency = 'EUR' | 'GBP' | 'CNY' | 'JPY' | 'KRW' | 'AUD'
type CreateSetValuesInput = Record<Currency, number>

const cache = cacheStorage.get<Cache>(UNIQUE_FILE_ID)
cache.setData({})

// Fills the object with values for each currency
export const createSetValues = ({ GBP, EUR, CNY, JPY, KRW, AUD }: CreateSetValuesInput) => (
  (value: number) => ({
    USD: value,
    EUR: value / EUR,
    GBP: value / GBP,
    CNY: value / CNY,
    JPY: value / JPY,
    KRW: value / KRW,
    AUD: value / AUD,
  })
)

export const cacheWrapper = <T extends () => Promise<any>>(method: T, cacheKey: string) => (
  async (): Promise<Awaited<ReturnType<T>>> => {
    const cachedData = cache.getData() || {}

    if (cachedData[cacheKey]) {
      return cachedData[cacheKey]
    }

    const value = await method()

    if (value) {
      cache.setData({
        ...cachedData,
        [cacheKey]: value,
      })
    }

    return value
  }
)
