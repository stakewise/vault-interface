import cookie, { CookieAttributes } from 'js-cookie'

import cookieNames from './constants/cookieNames'


const get = cookie.get

const set = async (name: string, value: string, attributes: CookieAttributes = {}) => {
  const isValid = Object.values(cookieNames).includes(name)

  const options: CookieAttributes = attributes

  if (!isValid) {
    throw new Error(`Add cookie name "${name}" to constants`)
  }

  if (typeof window === 'undefined') {
    throw new Error('Do not use the cookie.set(...) method on the server')
  }

  const isDev = window.location.hostname.startsWith('http://local')

  try {
    const isFrame = window.self !== window.top

    if (isFrame) {
      options.sameSite = 'none'
      options.secure = true
    }
  }
  catch {}

  if (isDev) {
    options.secure = false
  }

  cookie.set(name, value, options)
}


export default {
  set,
  get,
}
