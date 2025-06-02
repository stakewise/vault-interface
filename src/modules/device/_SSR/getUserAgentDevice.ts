import { UAParser } from 'ua-parser-js'
import { headers } from 'next/headers'


const getUserAgentDevice = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const { device } = UAParser(userAgent)

  const isMobile = device.is('mobile') || device.is('tablet')

  return {
    isMobile: isMobile,
    isDesktop: !isMobile,
    isCalculated: false,
  }
}


export default getUserAgentDevice
