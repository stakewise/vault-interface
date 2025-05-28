import { expect } from '@playwright/test'

import { createSetTheme } from './setTheme'


type Wrapper = E2E.FixtureMethod<CheckTheme, 'page' | 'helpers'>

export type CheckTheme = () => Promise<void>

const themeList = [ 'dark', 'light' ] as const

export const createCheckTheme: Wrapper = ({ page, helpers }) => (
  async () => {
    const setTheme = createSetTheme({ page, helpers })
    for (const theme of themeList) {
      await setTheme(theme)

      const cookieTheme = await helpers.getCookiesItem('SW_themeColor')
      expect(cookieTheme?.value).toBe(theme)

      const hasThemeClass = await page.evaluate((theme) => {
        return document.body.classList.contains(`body-${theme}-theme`)
      }, theme)

      expect(hasThemeClass).toBe(true)

      await page.reload()

      expect(cookieTheme?.value).toBe(theme)
      expect(hasThemeClass).toBe(true)
    }
  }
)
