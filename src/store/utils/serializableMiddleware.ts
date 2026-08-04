import { stringify, parse } from 'superjson'
import type { Middleware } from '@reduxjs/toolkit'


const serializableMiddleware: Middleware = () => (next) => (action: any) => {
  if (action.payload && typeof action.payload === 'object') {
    try {
      const serialized = stringify(action.payload)

      action.payload = parse(serialized)
    }
    catch (error) {
      console.error('Failed to serialize payload:', error)
    }
  }

  return next(action)
}


export default serializableMiddleware
