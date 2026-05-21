'use client'
import { useState, useCallback, useEffect, RefCallback } from 'react'
import { useDeepMemo } from 'hooks'


export type Opts = Partial<IntersectionObserverInit & {
  once: boolean
}>

type Result<T extends Element = Element> = {
  ref: RefCallback<T>
  entry: IntersectionObserverEntry | null
  isVisible: boolean
}

/** Calls re-render each time the entry changes.
 *  Without providing any options, it will be called when an element is
 *  fully visible or hidden in the viewport.
 *  To determine if an element is partially out of viewport we can provide option
 *  threshold: 0.9999 (by default threshold is 0)
 *
 *  const { ref, entry, isVisible } = useEntry({
 *    threshold: 0.9999
 *  })
 *
 *  return (
 *    <>
 *      <Element isVisible={isVisible} />
 *      <div ref={ref} />
 *    </>
 *  )
 */
const useEntry = <T extends Element = Element>(opts: Opts = {}): Result<T> => {
  const [ entry, setEntry ] = useState<IntersectionObserverEntry | null>(null)
  const [ node, setNode ] = useState<T | null>(null)

  const ref = useCallback<RefCallback<T>>((element) => {
    setNode(element)
  }, [])

  const stableOpts = useDeepMemo(() => opts, [ opts ])

  useEffect(() => {
    if (!node || typeof IntersectionObserver === 'undefined') {
      setEntry(null)

      return
    }

    const { once, ...observerProps } = stableOpts
    const observer = new IntersectionObserver(([ intersectionEntry ]) => {
      if (!intersectionEntry) {
        return
      }

      setEntry(intersectionEntry)

      if (once && intersectionEntry.isIntersecting) {
        observer.disconnect()
      }
    }, observerProps)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [ node, stableOpts ])

  return {
    ref,
    entry,
    isVisible: Boolean(entry?.isIntersecting),
  }
}


export default useEntry
