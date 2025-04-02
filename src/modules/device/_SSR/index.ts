import getCookieDevice from './getCookieDevice'
import getUserAgentDevice from './getUserAgentDevice'


const getServerDevice = (): Device.Context => {
  const cookieDevice = getCookieDevice()
  const userAgentDevice = getUserAgentDevice()

  return cookieDevice || userAgentDevice
}


export { getServerDevice }
