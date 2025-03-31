import { useCallback, useEffect, useMemo } from 'react'
import { constants } from 'helpers'
import { useActions, useStore } from 'hooks'
import intl from 'sw-modules/intl'
import { localStorage } from 'sdk'
import theme, { ThemeValue, ThemeColor } from 'sw-modules/theme'

import { MenuDropdownProps } from 'components/MenuDropdown/MenuDropdown'

import { currencyOptions, languageOptions, OptionsType } from './options'

import messages from './messages'


type DropdownOptionOnChange = MenuDropdownProps['options'][number]['onChange']

const storeSelector = (store: Store) => ({
  currency: store.currency.selected,
})

const useAppConfig = () => {
  const actions = useActions()
  const translations = intl.useIntl()
  const { currency } = useStore(storeSelector)
  const { systemTheme, cookieTheme, isSystemTheme, setTheme } = theme.useData()

  const themeValue = isSystemTheme ? ThemeValue.System : cookieTheme

  useEffect(() => {
    const savedCurrency = localStorage.getItem<Currency>(constants.localStorageNames.currency)

    if (savedCurrency && savedCurrency !== currency) {
      const isValidCurrency = currencyOptions.some(({ value }) => value === savedCurrency)

      if (isValidCurrency) {
        actions.currency.setData(savedCurrency)
        return
      }
    }

    actions.currency.setData(currencyOptions[0].value as Currency)
  }, [])

  const handleChangeTheme = useCallback((theme: ThemeValue) => {
    setTheme(theme)
  }, [ setTheme ])

  const handleChangeCurrency = useCallback((value: string) => {
    actions.currency.setData(value as Store['currency']['selected'])

    localStorage.setItem(constants.localStorageNames.currency, value)
  }, [ actions ])

  const handleChangeLanguage = useCallback((language: Intl.LanguagesKeys) => {
    translations.setLocale(language)
  }, [ translations ])

  const themeOptions = useMemo<OptionsType[]>(() => [
    {
      logo: 'theme/sun',
      value: ThemeValue.Light,
      title: messages.theme.light,
    },
    {
      logo: 'theme/moon',
      value: ThemeValue.Dark,
      title: messages.theme.dark,
    },
    {
      value: ThemeValue.System,
      title: messages.theme.system,
      logo: systemTheme === ThemeColor.Dark ? 'theme/moon' : 'theme/sun',
    },
  ], [ systemTheme ])

  return useMemo(() => {
    const language = languageOptions.find(({ value }) => value === translations.locale)?.title
    const themeDescription = messages.theme[themeValue as keyof typeof messages.theme]

    const themeOption = {
      title: messages.theme.title,
      subTitle: themeDescription,
      icon: 'icon/theme',
      value: themeValue,
      options: themeOptions,
      dataTestId: 'settings-theme',
      ariaLabel: messages.changeTheme,
      onChange: handleChangeTheme as DropdownOptionOnChange,
    }

    const currencyOption = {
      title: messages.currency,
      subTitle: currency,
      icon: 'icon/money',
      value: currency,
      options: currencyOptions,
      dataTestId: 'settings-currency',
      ariaLabel: messages.changeCurrency,
      onChange: handleChangeCurrency as DropdownOptionOnChange,
    }

    const languageOption = {
      title: messages.language.title,
      subTitle: language,
      icon: 'icon/earth',
      value: translations.locale,
      options: languageOptions,
      dataTestId: 'settings-language',
      ariaLabel: messages.changeLanguage,
      onChange: handleChangeLanguage as DropdownOptionOnChange,
    }

    const result = [
      languageOption,
      currencyOption,
      themeOption,
    ]
      .filter(({ options }) => options.length > 1)

    return result as MenuDropdownProps['options']
  }, [
    currency,
    themeValue,
    translations,
    themeOptions,
    handleChangeTheme,
    handleChangeCurrency,
    handleChangeLanguage,
  ])
}


export default useAppConfig
