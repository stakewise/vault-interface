import { useState, RefObject } from 'react'

import useEntryListener, { Opts, UseEntryListenerResult } from './useEntryListener'


type Result = {
  ref: RefObject<any>,
  entry: IntersectionObserverEntry | null,
  isVisible: boolean,
  unobserve: UseEntryListenerResult['observer']['unobserve'],
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
const useEntry = (opts: Opts = {}): Result => {
  const [ entry, setEntry ] = useState<IntersectionObserverEntry | null>(null)
  const { ref, observer } = useEntryListener(setEntry, opts)

  const isVisible = Boolean(entry?.isIntersecting)
  const unobserve = observer?.unobserve

  return {
    ref,
    entry,
    isVisible,
    unobserve,
  }
}


export default useEntry
