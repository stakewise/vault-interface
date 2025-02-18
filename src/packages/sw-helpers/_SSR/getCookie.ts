import { cookies, headers } from 'next/headers'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'


// The first cookie setting is not available in the first render process.
// You need to either redirect with already installed cookies to the same url,
// so that the request already contains installed cookies, or do as here.
// https://github.com/vercel/next.js/issues/49442#issuecomment-1679807704
const getCookie = (cookieName: string) => {
  const allCookiesAsString = headers().get('Set-Cookie')

  if (!allCookiesAsString) {
    return cookies().get(cookieName)
  }

  const allCookiesAsObjects = allCookiesAsString
    .split(', ')
    .map((singleCookieAsString) => parseCookie(singleCookieAsString.trim()))

  const targetCookieAsObject = allCookiesAsObjects.find(
    (singleCookieAsObject) => typeof singleCookieAsObject.get(cookieName) == 'string'
  )

  if (!targetCookieAsObject) {
    return cookies().get(cookieName)
  }

  return {
    name: cookieName,
    value: targetCookieAsObject.get(cookieName) ?? '',
  }
}


export default getCookie
