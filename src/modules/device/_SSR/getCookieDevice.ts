import * as constants from 'helpers/constants'


const getCookieDevice = async () => {
  const { cookies } = await import('next/headers')

  const cookiesState = await cookies()
  const cookieDevice = cookiesState.get(constants.cookieNames.device)?.value

  if (cookieDevice) {
    try {
      const parsedDevice = JSON.parse(cookieDevice)

      const isMobile = Boolean(parsedDevice?.isMobile)
      const isTablet = Boolean(parsedDevice?.isTablet)
      const isDesktop = Boolean(parsedDevice?.isDesktop)

      return {
        isTablet,
        isMobile,
        isDesktop,
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
