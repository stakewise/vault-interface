import cookie from 'helpers/cookie'
import * as constants from 'helpers/constants'


const getRpcForE2E = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const e2eCookieValue = cookie.get(constants.cookieNames.e2e)

  return e2eCookieValue ? 'http://localhost:8545' : null
}


export default getRpcForE2E
