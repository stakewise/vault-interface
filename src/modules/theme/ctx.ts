'use client'
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import useObjectState from 'hooks/controls/useObjectState'
import * as constants from 'helpers/constants'
import initContext from 'helpers/initContext'
import cookie from 'helpers/cookie'

import { ThemeClasses, ThemeValue, ThemeColor } from './enum'


const isIpfs = process.env.NEXT_PUBLIC_IPFS === 'true'

const initialContext: Theme.Context = {
  themeValue: ThemeColor.Light,
  cookieTheme: ThemeColor.Light,
  systemTheme: ThemeColor.Light,
  isSystemTheme: true,
  isDark: false,
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
  const getInitialTheme = (): Theme.State => {
    if (isIpfs) {
      const savedTheme = cookie.get(constants.cookieNames.themeColor) as ThemeColor
      const savedIsSystem = cookie.get(constants.cookieNames.isSystemTheme)

      if (savedTheme || savedIsSystem) {
        const isSystem = savedIsSystem === 'true'

        return {
          isSystemTheme: isSystem,
          cookieTheme: savedTheme || ThemeColor.Light,
          systemTheme: isSystem ? (savedTheme || ThemeColor.Light) : ThemeColor.Light,
        }
      }
    }

    return {
      isSystemTheme: serverTheme.isSystemTheme,
      cookieTheme: serverTheme.value || ThemeColor.Light,
      systemTheme: serverTheme.isSystemTheme && serverTheme.value ? serverTheme.value : ThemeColor.Light,
    }
  }

  const [ { cookieTheme, systemTheme, isSystemTheme }, setState ] = useObjectState<Theme.State>(getInitialTheme())

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
    else {
      setThemeClassName(cookieTheme)
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

  const themeValue = isSystemTheme ? systemTheme : cookieTheme
  const isDark = themeValue === ThemeColor.Dark

  return useMemo(() => ({
    isDark,
    themeValue,
    cookieTheme,
    systemTheme,
    isSystemTheme,
    setTheme,
  }), [
    isDark,
    themeValue,
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
