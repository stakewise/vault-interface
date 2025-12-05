import cookie from 'helpers/cookie'
import * as constants from 'helpers/constants'


const insertMockE2E = <T>(key: string): T | undefined => {
  if (typeof window === 'undefined') {
    return
  }

  const isTestsEnabled = cookie.get(constants.cookieNames.e2e)

  if (isTestsEnabled) {
    return window.e2e?.[key]
  }
}


export default insertMockE2E
