import { parse } from 'superjson'


const serializeStore = (store?: string) => {
  if (!store) {
    return
  }

  try {
    return parse(store)
  }
  catch (error) {
    console.error('Failed to serialize store:', error)

    return {}
  }
}


export default serializeStore
