import getCookieDevice from './getCookieDevice'
import getUserAgentDevice from './getUserAgentDevice'


const getServerDevice = async (): Promise<Device.Context> => {
  const [ cookieDevice, userAgentDevice ] = await Promise.all([
    getCookieDevice(),
    getUserAgentDevice(),
  ])

  return cookieDevice || userAgentDevice
}


export { getServerDevice }
