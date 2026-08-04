import { act, renderHook } from '@testing-library/react'
import CacheStorage from './CacheStorage'

import useCacheListener from './useCacheListener'


describe('cache-storage/useCacheListener', () => {
  const cacheId = 'KEY'
  const cache = CacheStorage.get(cacheId)

  it('should return correct initial "data"', () => {
    cache.setData('DATA')
    const { result } = renderHook(() => useCacheListener(cacheId))
    const [ data ] = result.current

    expect(data).toBe('DATA')
  })

  it('should return correct "data" after set', () => {
    const { result } = renderHook(() => useCacheListener(cacheId))
    const [ _, setData ] = result.current

    act(() => {
      setData('DATA2')
    })

    const [ state ] = result.current

    expect(state).toBe('DATA2')
  })

  it('should return correct "data" after time is up', async () => {
    const { result } = renderHook(() => useCacheListener(cacheId))
    const [ _, setData ] = result.current

    act(() => {
      setData('DATA3', 1000)
    })

    await new Promise((r) => setTimeout(r, 2000))
    const [ state ] = result.current

    expect(state).toBe(null)
  })

  it('should return correct "data" if cache was canged from storage', async () => {
    const { result } = renderHook(() => useCacheListener(cacheId))
    const [ _, setData ] = result.current

    act(() => {
      setData('DATA4')
    })

    const [ firstRenderState ] = result.current
    expect(firstRenderState).toBe('DATA4')

    act(() => {
      cache.setData('DATA5')
    })

    const [ secondRenderState ] = result.current
    expect(secondRenderState).toBe('DATA5')
  })

  it('should return correct "data" if cache was deleted from storage', async () => {
    const { result } = renderHook(() => useCacheListener(cacheId))
    const [ _, setData ] = result.current

    act(() => {
      setData('DATA6')
    })

    const [ firstRenderState ] = result.current
    expect(firstRenderState).toBe('DATA6')

    act(() => {
      cache.resetData()
    })

    const [ secondRenderState ] = result.current
    expect(secondRenderState).toBe(null)
  })
})
