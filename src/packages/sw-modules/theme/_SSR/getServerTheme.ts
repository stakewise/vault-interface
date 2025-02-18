import * as constants from 'sw-helpers/constants'
import { cookies } from 'next/headers'
import { ThemeColor } from '../enum'


const availableThemes = [ ThemeColor.Light, ThemeColor.Dark ]

const getServerTheme = () => {
  const theme = cookies().get(constants.cookieNames.themeColor)?.value as ThemeColor
  const isSystemTheme = cookies().get(constants.cookieNames.isSystemTheme)?.value !== 'false'

  const isValid = availableThemes.includes(theme)

  return {
    value: isValid ? theme : undefined,
    isSystemTheme: isValid ? isSystemTheme : true,
  }
}


export default getServerTheme
