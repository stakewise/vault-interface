export class Cache<T> {
  private cache: {
    data: T | null
    changed: boolean
    time: number | null
  }

  private timeout: NodeJS.Timeout | null
  private listeners: Array<() => void>

  constructor() {
    this.cache = {
      data: null,
      time: null,
      changed: false,
    }

    this.timeout = null
    this.listeners = []
  }

  callTimer(time: number) {
    clearTimeout(this.timeout as NodeJS.Timeout)
    // Need to save "this", so don't do this - setTimeout(this.resetData, time)
    this.timeout = setTimeout(() => this.resetData(), time)
  }

  resetData() {
    this.cache = {
      data: null,
      time: null,
      changed: false,
    }

    clearTimeout(this.timeout as NodeJS.Timeout)
    this.callListeners()
  }

  setData(data: T | CacheStorage.UpdateCallback<T> | null, time: number = 1000 * 60 * 60 * 4): T | null {
    const cacheTime = Date.now() + time
    const updatedData = typeof data === 'function'
      ? (data as CacheStorage.UpdateCallback<T>)(this.cache.data)
      : data

    this.cache = {
      data: updatedData,
      time: cacheTime,
      changed: true,
    }

    // If the time is 0, the cache should not be cleared
    if (time !== 0) {
      this.callTimer(time)
    }

    this.callListeners()

    return this.cache.data
  }

  removeItem(key: keyof T) {
    const isValid = typeof this.cache.data === 'object'

    if (isValid && this.cache.data?.[key]) {
      delete this.cache.data[key]
    }
  }

  getData(): T | null {
    return this.cache.data
  }

  get isChanged() {
    return this.cache.changed
  }

  callListeners() {
    this.listeners.forEach((handler) => handler())
  }

  addListener(handler: Cache<T>['listeners'][number]) {
    this.listeners.push(handler)
  }

  removeListener(handler: Cache<T>['listeners'][number]) {
    this.listeners = this.listeners.filter((_handler) => _handler !== handler)
  }
}

class CacheStorage {
  caches: {
    [key: string]: Cache<any>
  }

  constructor() {
    this.caches = {}
  }

  get<T>(id: string): Cache<T> {
    if (this.caches[id]) {
      return this.caches[id]
    }

    return this.caches[id] = new Cache<T>()
  }
}


export default new CacheStorage
