import { RefObject } from 'react'


type Listener = (entry: IntersectionObserverEntry) => void

export type CreateObserverResult = {
  observe: (listener: Listener) => void
  unobserve: () => void
}

const createObserver = (ref: RefObject<Element>, observerProps: IntersectionObserverInit): CreateObserverResult => {
  let observer: IntersectionObserver

  return {
    observe: (listener) => {
      if (ref.current && typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(([ entry ]) => {
          listener(entry)
        }, observerProps)

        observer.observe(ref.current)
      }
    },
    unobserve: () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    },
  }
}


export default createObserver
