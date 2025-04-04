import { useDispatch } from 'react-redux'


type Method = (...args: any[]) => any

type MethodsObj = {
  [key: string]: Method | MethodsObj
}

const isObject = (value: any): boolean => value && !Array.isArray(value) && typeof value === 'object'

const wrapDispatchMethods = <
  T extends MethodsObj
>(methods: T, dispatch: ReturnType<typeof useDispatch>): T => {
  return Object.keys(methods).reduce((acc, initKey) => {
    const key = initKey as keyof T
    const value = methods[key]

    if (isObject(value)) {
      const methods = value as unknown
      const wrappedMethods = wrapDispatchMethods(methods as T, dispatch) as unknown

      acc[key] = wrappedMethods as T[keyof T]
    }
    else if (typeof value === 'function') {
      const method = value as Method
      const wrappedMethod = ((...args) => dispatch(method(...args))) as T[keyof T]

      acc[key] = wrappedMethod
    }

    return acc
  }, {} as T)
}


export default wrapDispatchMethods
