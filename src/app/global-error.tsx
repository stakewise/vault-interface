'use client'
import React, { useEffect } from 'react'
import cx from 'classnames'
import intl from 'sw-modules/intl'
import { Inter } from 'next/font/google'
import theme, { ThemeColor } from 'sw-modules/theme'
import { cookie, constants } from 'helpers'
import messages from 'views/ErrorView/messages'

import { Button, Text } from 'components'
import { allLanguages } from 'scripts/collectMessages/languages'

import 'scss/globals.scss'


type GlobalErrorViewProps = {
  error: Error
  reset: () => void
}

const font = Inter({
  preload: true,
  display: 'block',
  weight: [ '400', '500', '700' ],
  subsets: [ 'latin', 'cyrillic' ],
})

const GlobalError = ({ error, reset }: GlobalErrorViewProps) => {
  const cookieTheme = cookie.get(constants.cookieNames.themeColor) as ThemeColor
  const isSystemTheme = cookie.get(constants.cookieNames.isSystemTheme) !== 'false'
  const initialLocale = cookie.get(constants.cookieNames.language) as Intl.LanguagesKeys

  const isValidLocale = allLanguages.includes(initialLocale)

  const locale = isValidLocale ? initialLocale : 'en'

  const themeContext = theme.useInit({
    isSystemTheme,
    value: cookieTheme,
  })

  useEffect(() => {
    console.error(error)
  }, [ error ])

  return (
    <html lang={locale}>
    <body
      className={cx(font.className, {
        'body-dark-theme': cookieTheme === ThemeColor.Dark,
        'body-light-theme': cookieTheme === ThemeColor.Light,
      })}
    >
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (${isSystemTheme}) {
            const isDarkTheme = (
              window.matchMedia
              && window.matchMedia('(prefers-color-scheme: dark)').matches
            );
  
            if (isDarkTheme) {
              document.body.classList.add('body-dark-theme');
              document.body.classList.remove('body-light-theme');
            }
            else {
              document.body.classList.add('body-light-theme');
              document.body.classList.remove('body-dark-theme');
            }
          }
        `,
      }}
    />
    <div id="global-wrapper" className="page-error flex h-lvh">
      <theme.Provider value={themeContext}>
        <intl.IntlProvider
          locale={locale as Intl.LanguagesKeys}
          locales={allLanguages as unknown as Intl.LanguagesKeys[]}
        >
          <div className='width-container flex flex-1'>
            <div className="flex flex-col items-center justify-center m-auto max-w-[520rem]">
              <Text
                className="text-center"
                message={messages.error.title}
                color="dark"
                size="h32"
              />
              <Text
                className="mt-16 text-center"
                message={messages.error.text}
                color="dark"
                size="t14"
              />
              <Button
                className="mt-32"
                dataTestId="global-error-back-button"
                title={messages.buttonTitle}
                onClick={() => {
                  reset()
                  window.location.href = '/'
                }}
              />
            </div>
          </div>
        </intl.IntlProvider>
      </theme.Provider>
    </div>
    </body>
    </html>
  )
}


export default GlobalError
