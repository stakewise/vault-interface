import { cookies } from 'next/headers'
import * as constants from 'helpers/constants'


const getCookieDevice = () => {
  const cookieDevice = cookies().get(constants.cookieNames.device)?.value

  if (cookieDevice) {
    try {
      const parsedDevice = JSON.parse(cookieDevice)

      const isMobile = Boolean(parsedDevice?.isMobile)

      return {
        isDesktop: !isMobile,
        isMobile,
        isCalculated: false,
      }
    }
    catch {
      return null
    }
  }

  return null
}


export default getCookieDevice
