'use client'
import React, { useEffect, useMemo } from 'react'
import intl from 'modules/intl'
import theme from 'modules/theme'
import { polyfills } from 'helpers'
import { ReduxProvider } from 'store'
import { ConfigProvider } from 'config'
import device, { onDeviceChange } from 'modules/device'
import { createVaultInterfaceStore } from 'store/entries/vault-interface'

import languages from 'scripts/languages'
import { ImagesProvider } from 'components'
import AppLayout from 'layouts/AppLayout/AppLayout'


polyfills.promiseAllSettled()

// @ts-ignore: this crutch for fix redux-devtools
BigInt.prototype.toJSON = function () { return this.toString() }

type GlobalLayoutProps = {
  networkId: NetworkIds
  children: React.ReactNode
  locale: Intl.LanguagesKeys
  serverTheme: Theme.Input
  serializedStore?: string
  serverDevice: Device.Context
}

const GlobalLayout: React.FC<GlobalLayoutProps> = (values) => {
  const { children, networkId, locale: initialLocale, serverDevice, serverTheme, serializedStore } = values

  // Strange "_next" type values may come in
  const isValidLocale = languages.includes(initialLocale)
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

  const store = useMemo(() => {
    const skipSSR = typeof window !== 'undefined' && window.location.search
      ? new URLSearchParams(window.location.search).get('skipSSR') === 'true'
      : false

    if (serializedStore && !skipSSR) {
      return createVaultInterfaceStore(serializedStore)
    }

    return createVaultInterfaceStore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <theme.Provider value={themeContext}>
      <device.Provider value={deviceContext}>
        <intl.IntlProvider
          locale={locale as Intl.LanguagesKeys}
          locales={languages as unknown as Intl.LanguagesKeys[]}
        >
          <ReduxProvider store={store}>
            <ConfigProvider serverNetworkId={networkId}>
              <ImagesProvider>
                <div>
                  <AppLayout>
                    {children}
                  </AppLayout>
                  <div id="tooltips" />
                  <div id="bottomLoader" />
                  <output id="notifications" className="block" />
                </div>
              </ImagesProvider>
            </ConfigProvider>
          </ReduxProvider>
        </intl.IntlProvider>
      </device.Provider>
    </theme.Provider>
  )
}


export default GlobalLayout
