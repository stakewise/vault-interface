// ATTN Be sure to add the image to the images folder in the root of the project


export const logos = [
  'token/ETH',
  'token/GNO',
  'token/xDAI',
  'token/osETH',
  'token/osGNO',

  'connector/MMI',
  'connector/okx',
  'connector/rabby',
  'connector/taho',
  'connector/zengo',
  'connector/ledger',
  'connector/portis',
  'connector/coinbase',
  'connector/metamask',
  'connector/gnosisSafe',
  'connector/trustWallet',
  'connector/braveBrowser',
  'connector/walletConnect',
  'connector/monitorAddress',
  'image/error',
  'image/magic',
  'image/success',
  'image/information',

  'language/en',
  'language/de',
  'language/fr',
  'language/es',
  'language/pt',
  'language/ru',
  'language/zh',

  'theme/sun',
  'theme/moon',
] as const

export const icons = [
  'arrow/right',
  'arrow/down',
  'arrow/left',
  'arrow/up',
  'icon/gas',
  'icon/plus',
  'icon/info',
  'icon/gear',
  'icon/copy',
  'icon/link',
  'icon/close',
  'icon/check',
  'icon/loader',
  'icon/upload',
  'icon/warning',
  'icon/calendar',

  'currency/usd',
  'currency/eur',
  'currency/gbp',
  'currency/cny',
  'currency/jpy',
  'currency/krw',
  'currency/aud',
] as const


export const images = [
  ...icons,
  ...logos,
] as const

export default images
