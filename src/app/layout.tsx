import React from 'react'
import cx from 'classnames'
import { Viewport } from 'next'
import { Inter } from 'next/font/google'
import { commonMessages } from 'helpers'
import { getLocale } from 'sw-modules/intl/_SSR'
import { ThemeColor } from 'sw-modules/theme/enum'
import { getServerTheme } from 'sw-modules/theme/_SSR'
import { getServerDevice } from 'sw-modules/device/_SSR'
import GlobalLayout from 'layouts/GlobalLayout/GlobalLayout'
import { getNetworkId } from 'config/core/config/_SSR'
import { getVaultBase } from 'helpers/requests/_SSR'

import 'focus-visible'
import 'scss/globals.scss'


const owner = process.env.NEXT_PUBLIC_OWNER || ''
const domain = process.env.NEXT_PUBLIC_OWNER_DOMAIN || ''
const ownerTwitter = process.env.NEXT_PUBLIC_OWNER_X_ACCOUNT || ''

export const generateMetadata: GenerateMetadata = async () => {
  const locale = getLocale()
  const metaDescription = commonMessages.meta.home.description[locale] || ''

  let title = commonMessages.meta.home.title[locale]
  let description = owner ? `${owner} | ${metaDescription}` : metaDescription
  let image = '/og-image.png'

  const url = `https://${domain}/`

  try {
    const vaultBase = await getVaultBase()
    const vaultData = vaultBase?.data

    if (vaultData?.displayName) {
      title = owner ? `${vaultData.displayName} | ${owner}` : vaultData.displayName
    }
    if (vaultData?.description) {
      description = vaultData.description
    }
    if (vaultData?.imageUrl) {
      image = vaultData.imageUrl
    }
  }
  catch {}

  description = description.replace(/^(\n|\s)+|(\n|\s)+$/g, '')

  return {
    description,
    metadataBase: new URL(url),
    applicationName: owner ? `${owner} Vault Interface` : 'Vault Interface',
    manifest: new URL('/manifest.json', url),
    keywords: [ owner, 'staking', 'ETH', 'osETH' ].filter(Boolean),
    title: {
      template: owner ? `${owner} | %s` : '%s',
      absolute: title,
    },
    icons: {
      icon: [
        { url: '/logo512.png' }, new URL('/logo512.png', url),
      ],
      apple: [
        { url: '/logo180.png' },
        { url: '/logo180.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: [ '/logo192.png' ],
    },
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
        'fr-FR': `${url}?language=fr`,
        'ru-RU': `${url}?language=ru`,
        'de-DE': `${url}?language=de`,
        'es-ES': `${url}?language=es`,
        'pt-PT': `${url}?language=pt`,
        'zh-CN': `${url}?language=zh`,
      },
    },
    openGraph: {
      url,
      title,
      description,
      type: 'website',
      images: image,
      siteName: owner,
    },
    twitter: {
      url,
      title,
      domain,
      description,
      siteName: owner,
      images: {
        url: image,
        alt: owner ? `${owner} logo` : 'logo',
      },
      creator: ownerTwitter,
      card: 'summary_large_image',
    },
  }
}

const viewport: Viewport = {
  // TODO add verification after release
  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#verification
  colorScheme: 'light dark',
  themeColor: '#eeebf3',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export { viewport }

type RootLayoutProps = {
  children: React.ReactNode
}

const font = Inter({
  preload: true,
  display: 'block',
  weight: [ '400', '500', '700' ],
  subsets: [ 'latin', 'cyrillic' ],
})

const RootLayout = async (props: RootLayoutProps) => {
  const { children } = props

  const locale = getLocale()
  const device = getServerDevice()
  const networkId = getNetworkId()
  const serverTheme = getServerTheme()
  const vaultBase = await getVaultBase()

  return (
    <html lang={locale}>
      <body
        className={cx(font.className, {
          'body-dark-theme': serverTheme.value === ThemeColor.Dark,
          'body-light-theme': serverTheme.value === ThemeColor.Light,
        })}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (${serverTheme.isSystemTheme}) {
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
        {/* special div for 404 page */}
        <div id="global-wrapper">
          <GlobalLayout
            locale={locale}
            networkId={networkId}
            vaultBase={vaultBase}
            serverDevice={device}
            serverTheme={serverTheme}
          >
            {children}
          </GlobalLayout>
        </div>
      </body>
    </html>
  )
}


export default RootLayout
