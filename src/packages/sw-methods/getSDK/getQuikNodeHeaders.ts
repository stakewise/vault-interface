import cookie from 'sw-helpers/cookie'
import * as constants from 'sw-helpers/constants'


type Output = StakeWise.UrlWithHeaders['headers']

const getQuikNodeHeaders = (token?: string): Output => {
  let headers = {}

  if (typeof window === 'undefined') {
    headers = {
      'Authorization': `Bearer ${token}`,
      'Referer': 'https://app.stakewise.io/',
    }
  }
  else {
    const clientToken = cookie.get(constants.cookieNames.quickNodeToken)

    if (!clientToken) {
      throw new Error('QuickNode token is not provided')
    }

    headers = {
      'Authorization': `Bearer ${clientToken}`,
    }
  }

  return headers
}


export default getQuikNodeHeaders
