declare global {

  namespace CacheStorage {

    type UpdateCallback<T> = (data: T | null) => T | null

    type Cache<T> = {
      setData: (data: T | UpdateCallback<T> | null, time?: number) => T | null
      getData: () => T | null
      resetData: () => void
      addListener(handler: () => void): void
      removeListener(handler: () => void): void
    }
  }
}

import CacheStorage from './CacheStorage'


export default CacheStorage
