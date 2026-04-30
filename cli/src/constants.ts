import pc from 'picocolors'
import prompts from 'prompts'

import { log } from './helpers'
import { Network } from './types'


export const promptOptions: prompts.Options = {
  onCancel: () => {
    log(pc.yellow('\nCancelled.'))
    process.exit(1)
  },
}

export const repo = 'stakewise/vault-interface'

export const networks: readonly Network[] = [ 'mainnet', 'gnosis', 'hoodi' ] as const

export const networkLabels: Record<Network, string> = {
  mainnet: 'Ethereum Mainnet',
  gnosis: 'Gnosis Chain',
  hoodi: 'Hoodi Testnet',
}

export const networkChoices: prompts.Choice[] = [
  { title: 'Ethereum Mainnet', value: 'mainnet' },
  { title: 'Gnosis Chain', value: 'gnosis' },
  { title: 'Hoodi Testnet', value: 'hoodi' },
]

export const localeChoices: prompts.Choice[] = [
  { title: 'English (en)', value: 'en' },
  { title: 'Russian (ru)', value: 'ru' },
  { title: 'French (fr)', value: 'fr' },
  { title: 'Spanish (es)', value: 'es' },
  { title: 'Portuguese (pt)', value: 'pt' },
  { title: 'German (de)', value: 'de' },
  { title: 'Chinese (zh)', value: 'zh' },
]

export const currencyChoices: prompts.Choice[] = [
  { title: 'USD', value: 'usd' },
  { title: 'EUR', value: 'eur' },
  { title: 'GBP', value: 'gbp' },
  { title: 'CNY', value: 'cny' },
  { title: 'JPY', value: 'jpy' },
  { title: 'KRW', value: 'krw' },
  { title: 'AUD', value: 'aud' },
]

export const defaultCsp = 'https://app.safe.global https://*.blockscout.com'

export const settingsLightPrimary = `'primary': #3a8eea,`

export const settingsDarkPrimary = `'primary': #5c87f6,`

export const baseLightRgb = '--primary-rgb: 58, 142, 234;'

export const baseLightFn = '--primary: rgb(58, 142, 234);'

export const baseDarkRgb = '--primary-rgb: 92, 135, 246;'

export const baseDarkFn = '--primary: rgb(92, 135, 246);'
