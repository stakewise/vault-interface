import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckLanguage, 'page' | 'helpers' | 'element'>

export type CheckLanguage = () => Promise<void>

const languageList = [
  {
    value: 'en',
    title: 'English',
  },
  {
    value: 'ru',
    title: 'Русский',
  },
  {
    value: 'fr',
    title: 'Français',
  },
  {
    value: 'es',
    title: 'Español',
  },
  {
    value: 'pt',
    title: 'Português',
  },
  {
    value: 'de',
    title: 'Deutsch',
  },
  {
    value: 'zh',
    title: '繁體中文',
  },
]

export const createCheckLanguage: Wrapper = ({ page, helpers, element }) => (
  async () => {
    for (const language of languageList) {
      await page.getByTestId('settings-toggle-button').click()
      await helpers.changeSelect('settings-language', language.value)

      const cookieLanguage = await helpers.getCookiesItem('SW_language')
      expect(cookieLanguage?.value).toBe(language.value)

      await page.reload()

      expect(cookieLanguage?.value).toBe(language.value)
      await page.getByTestId('settings-toggle-button').click()
      await element.checkText({ testId: 'settings-language-button-subtitle', expectedText: language.title })

      await page.getByTestId('settings-toggle-button').click()
    }
  }
)
