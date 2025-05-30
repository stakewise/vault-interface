import { UAParser } from 'ua-parser-js'
import { headers } from 'next/headers'


const getUserAgentDevice = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const serverUI = new UAParser(userAgent)

  const device = serverUI.getDevice().type
  const isMobile = device === 'mobile' || device === 'tablet'

  return {
    isMobile: isMobile,
    isDesktop: !isMobile,
    isCalculated: false,
  }
}


export default getUserAgentDevice
