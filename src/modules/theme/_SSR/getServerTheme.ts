import * as constants from 'helpers/constants'
import { cookies } from 'next/headers'
import { ThemeColor } from '../enum'


const availableThemes = [ ThemeColor.Light, ThemeColor.Dark ]

const getServerTheme = async () => {
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
