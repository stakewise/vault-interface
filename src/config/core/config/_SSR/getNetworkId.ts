import * as constants from 'helpers/constants'
import { getCookie } from 'helpers/_SSR'


const getNetworkId = async (): Promise<NetworkIds> => {
  const result = await getCookie(constants.cookieNames.networkId)

  return (result?.value || 'mainnet') as NetworkIds
}


export default getNetworkId
