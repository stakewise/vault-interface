import { UAParser } from 'ua-parser-js'
import { headers } from 'next/headers'


const getUserAgentDevice = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const serverUI = new UAParser(userAgent)

  const device = serverUI.getDevice().type
  const isMobile = device === 'mobile'
  const isTablet = device === 'tablet'

  return {
    isTablet,
    isMobile: isMobile,
    isDesktop: !isMobile,
    isCalculated: false,
  }
}


export default getUserAgentDevice
