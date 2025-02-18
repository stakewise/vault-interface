import cookie from 'sw-helpers/cookie'
import * as constants from 'sw-helpers/constants'


const getTestUrl = () => {
  const e2eCookieValue = cookie.get(constants.cookieNames.e2e)
  const isBeforeProd = typeof IS_BEFORE_PROD !== 'undefined' && IS_BEFORE_PROD
  const isTestUrlAllowed = !IS_PROD || isBeforeProd

  if (isTestUrlAllowed && e2eCookieValue) {
    return 'http://localhost:8545'
  }

  return null
}


export default getTestUrl
