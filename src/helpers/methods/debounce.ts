type Procedure = (...args: any[]) => void

// eslint-disable-next-line max-len
function debounce<F extends Procedure>(func: F, wait: number, immediate?: boolean): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    const later = function () {
      timeout = undefined

      if (!immediate) {
        func.apply(context, args)
      }
    }

    const callNow = immediate && timeout === undefined

    if (timeout !== undefined) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(context, args)
    }
  }
}


export default debounce
