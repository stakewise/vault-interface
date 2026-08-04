import { ThemeColor } from '../enum'
import * as constants from 'helpers/constants'


const isIpfs = process.env.NEXT_PUBLIC_IPFS === 'true'

const availableThemes = [ ThemeColor.Light, ThemeColor.Dark ]

const getServerTheme = async () => {
  if (isIpfs) {
    return { value: undefined, isSystemTheme: true }
  }

  const { cookies } = await import('next/headers')

  const cookiesStore = await cookies()
  const theme = cookiesStore.get(constants.cookieNames.themeColor)?.value as ThemeColor
  const isSystemTheme = cookiesStore.get(constants.cookieNames.isSystemTheme)?.value !== 'false'

  const isValid = availableThemes.includes(theme)

  return {
    value: isValid ? theme : undefined,
    isSystemTheme: isValid ? isSystemTheme : true,
  }
}


export default getServerTheme
