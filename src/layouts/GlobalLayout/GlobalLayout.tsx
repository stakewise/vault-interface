'use client'
import React, { useEffect } from 'react'
import intl from 'sw-modules/intl'
import theme from 'sw-modules/theme'
import { ConfigProvider } from 'config'
import { polyfills } from 'helpers'
import device, { onDeviceChange } from 'sw-modules/device'

import { ImagesProvider } from 'sw-components'
import AppLayout from 'layouts/AppLayout/AppLayout'

import { allLanguages } from 'scripts/collectMessages/languages'


polyfills.promiseAllSettled()

// @ts-ignore: this crutch for fix redux-devtools
BigInt.prototype.toJSON = function () { return this.toString() }

type GlobalLayoutProps = {
  networkId: NetworkIds
  children: React.ReactNode
  locale: Intl.LanguagesKeys
  serverTheme: Theme.Input
  serverDevice: Device.Context
}

const GlobalLayout: React.FC<GlobalLayoutProps> = (values) => {
  const { children, networkId, locale: initialLocale, serverDevice, serverTheme } = values

  // Strange "_next" type values may come in
  const isValidLocale = allLanguages.includes(initialLocale)
  const locale = isValidLocale ? initialLocale : 'en'

  const themeContext = theme.useInit(serverTheme)

  const deviceContext = device.useInit({
    initialValue: serverDevice,
    onChange: onDeviceChange,
  })

  useEffect(() => {
    // reload page after 24 hours
    setTimeout(() => window.location.reload(), 60 * 60 * 24 * 1000)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [ locale ])

  return (
    <theme.Provider value={themeContext}>
      <device.Provider value={deviceContext}>
        <intl.IntlProvider
          locale={locale as Intl.LanguagesKeys}
          locales={allLanguages as unknown as Intl.LanguagesKeys[]}
        >
          <ConfigProvider serverNetworkId={networkId}>
            <ImagesProvider>
              <div>
                <AppLayout>
                  {children}
                </AppLayout>
                <div id="tooltips" />
                <div id="bottomLoader" />
                <div id="notifications" />
              </div>
            </ImagesProvider>
          </ConfigProvider>
        </intl.IntlProvider>
      </device.Provider>
    </theme.Provider>
  )
}


export default GlobalLayout
