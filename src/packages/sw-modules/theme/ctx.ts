import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import * as constants from 'helpers/constants'
import initContext from 'sw-helpers/initContext'
import { useObjectState } from 'sw-hooks'
import cookie from 'sw-helpers/cookie'

import { ThemeClasses, ThemeValue, ThemeColor } from './enum'


const initialContext: Theme.Context = {
  themeValue: ThemeColor.Light,
  cookieTheme: ThemeColor.Light,
  systemTheme: ThemeColor.Light,
  isSystemTheme: true,
  setTheme: () => {},
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  ? useLayoutEffect
  : useEffect

const {
  Provider,
  useData,
  useInit,
} = initContext<Theme.Context, Theme.Input>(initialContext, (serverTheme) => {
  const [ { cookieTheme, systemTheme, isSystemTheme }, setState ] = useObjectState<Theme.State>({
    cookieTheme: serverTheme.value || ThemeColor.Light,
    systemTheme: serverTheme.isSystemTheme && serverTheme.value ? serverTheme.value : ThemeColor.Light,
    isSystemTheme: serverTheme.isSystemTheme,
  })

  const setThemeClassName = useCallback((theme: ThemeColor) => {
    const isDark = theme === ThemeColor.Dark
    const addClass = isDark ? ThemeClasses.Dark : ThemeClasses.Light
    const removeClass = isDark ? ThemeClasses.Light : ThemeClasses.Dark

    document.body.classList.add(addClass)
    document.body.classList.remove(removeClass)
  }, [])

  const getSystemTheme = useCallback(() => {
    const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    return darkThemeQuery.matches ? ThemeColor.Dark : ThemeColor.Light
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (isSystemTheme) {
      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleSetTheme = () => {
        const systemTheme = getSystemTheme()

        cookie.set(constants.cookieNames.themeColor, systemTheme)

        setThemeClassName(systemTheme)

        setState({
          systemTheme,
        })
      }

      handleSetTheme()

      darkThemeQuery.addEventListener('change', handleSetTheme)

      return () => {
        darkThemeQuery.removeEventListener('change', handleSetTheme)
      }
    }
  }, [ isSystemTheme, getSystemTheme, setThemeClassName, setState ])

  const setTheme = useCallback((theme: ThemeValue) => {
    const isSystemTheme = theme === ThemeValue.System
    const systemTheme = getSystemTheme()
    const cookieTheme = (isSystemTheme ? systemTheme : theme) as ThemeColor

    cookie.set(constants.cookieNames.themeColor, cookieTheme)

    cookie.set(constants.cookieNames.isSystemTheme, String(isSystemTheme))

    setThemeClassName(cookieTheme)

    setState({
      cookieTheme,
      systemTheme,
      isSystemTheme,
    })
  }, [ getSystemTheme, setThemeClassName, setState ])

  return useMemo(() => ({
    themeValue: isSystemTheme ? systemTheme : cookieTheme,
    cookieTheme,
    systemTheme,
    isSystemTheme,
    setTheme,
  }), [
    cookieTheme,
    systemTheme,
    isSystemTheme,
    setTheme,
  ])
})


export default {
  Provider,
  useData,
  useInit,
}
