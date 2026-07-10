import CacheStorage from './CacheStorage'


describe('helpers/getter/CacheStorage', () => {
  const cacheId = 'KEY'
  const cache = CacheStorage.get(cacheId)

  it('should set and get value by key', () => {
    cache.setData('DATA')

    expect(cache.getData()).toBe('DATA')
  })

  it('should reset value by key', () => {
    cache.resetData()
    expect(cache.getData()).toBe(null)
  })

  it('should reset value after timeout', async () => {
    cache.setData('DATA', 1000)
    expect(cache.getData()).toBe('DATA')

    await new Promise((r) => setTimeout(r, 2000))
    expect(cache.getData()).toBe(null)
  })
})
