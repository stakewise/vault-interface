'use client'
import React, { useEffect } from 'react'
import cx from 'classnames'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import intl from 'sw-modules/intl'
import theme, { ThemeColor } from 'sw-modules/theme'
import { cookie, constants } from 'helpers'

import zeplinImage from 'views/ErrorView/images/zeplin.png'
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

  const isValidLocale = (allLanguages as Intl.LanguagesKeys[]).includes(initialLocale)

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
        <div className="width-container flex-1 flex h-[100vh]">
          <div className="flex flex-col items-center justify-center m-auto">
            <theme.Provider value={themeContext}>
              <intl.IntlProvider
                locale={locale as Intl.LanguagesKeys}
                locales={allLanguages as unknown as Intl.LanguagesKeys[]}
              >
                <Image
                  src={zeplinImage.src}
                  width={293}
                  height={172}
                  alt=""
                />
                <Text
                  className="mt-64 text-center"
                  message={messages.error.title}
                  color="p600"
                  size="6xl"
                />
                <Text
                  className="mt-20 text-center max-w-[320rem]"
                  message={messages.error.text}
                  color="p900"
                  size="lg"
                />
                <Button
                  className="mt-64"
                  bgColor="primary"
                  title={messages.buttonTitle}
                  size="md"
                  onClick={() => {
                    reset()
                    window.location.href = '/'
                  }}
                />
              </intl.IntlProvider>
            </theme.Provider>
          </div>
        </div>
      </body>
    </html>
  )
}


export default GlobalError
