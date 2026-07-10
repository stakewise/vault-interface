import getCookieDevice from './getCookieDevice'
import getUserAgentDevice from './getUserAgentDevice'


const isIpfs = process.env.NEXT_PUBLIC_IPFS === 'true'

const defaultDevice: Device.Context = {
  isTablet: false,
  isMobile: false,
  isDesktop: true,
  isCalculated: false,
}

const getServerDevice = async (): Promise<Device.Context> => {
  if (isIpfs) {
    return defaultDevice
  }

  const [ cookieDevice, userAgentDevice ] = await Promise.all([
    getCookieDevice(),
    getUserAgentDevice(),
  ])

  return cookieDevice || userAgentDevice
}


export { getServerDevice }
