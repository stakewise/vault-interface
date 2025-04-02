import * as constants from 'helpers/constants'
import { getCookie } from 'sw-helpers/_SSR'


const getNetworkId = (): NetworkIds => {
  const networkId = getCookie(constants.cookieNames.networkId)?.value || 'mainnet'

  return networkId as NetworkIds
}


export default getNetworkId
