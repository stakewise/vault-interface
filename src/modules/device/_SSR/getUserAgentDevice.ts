import { UAParser } from 'ua-parser-js'


const getUserAgentDevice = async () => {
  const { headers } = await import('next/headers')

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
