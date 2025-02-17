import ctx from './ctx'
import { ThemeValue, ThemeColor } from './enum'


declare global {

  namespace Theme {

    type State = {
      cookieTheme: ThemeColor
      systemTheme: ThemeColor
      isSystemTheme: boolean
    }

    type Context = State & {
      themeValue: ThemeColor
      setTheme: (theme: ThemeValue) => void
    }

    type Input = {
      value?: ThemeColor
      isSystemTheme: boolean
    }
  }
}

export { ThemeValue, ThemeColor }
export default ctx
