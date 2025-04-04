const fs = require('fs')
const { isAddress } = require('ethers')
const path = require('path')


const appDir = path.resolve(__dirname, `../`)
const localEnvFileName = '.env.local'
const localEnv = path.resolve(appDir, localEnvFileName)

const booleanValues = [ 'true', 'false' ]
const arrayKeys = [ 'NEXT_PUBLIC_LOCALES', 'NEXT_PUBLIC_CURRENCIES' ]
const availableLocales = [ 'en', 'ru', 'fr', 'es', 'pt', 'de', 'zh' ]
const availableCurrencies = [ 'usd', 'eur', 'gbp', 'cny', 'jpy', 'krw', 'aud' ]


const getEnvList = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8')

  const result = {}

  file
    .split('\n')
    .filter((line) => !/^#/.test(line))
    .forEach((envLine) => {
      const [ key, value ] = envLine.split('=')

      if (key && value) {
        let formattedValue = value

        if (booleanValues.includes(value)) {
          formattedValue = value === 'true'
        }
        if (arrayKeys.includes(key)) {
          formattedValue = value
            .replace(/["']/g, '')
            .split(',')
            .filter(Boolean)
            .map((val) => val.trim().toLowerCase())

          if (key === 'NEXT_PUBLIC_LOCALES') {
            formattedValue = formattedValue.filter((locale) => availableLocales.includes(locale))
          }
          if (key === 'NEXT_PUBLIC_CURRENCIES') {
            formattedValue = formattedValue.filter((currency) => availableCurrencies.includes(currency))
          }
        }

        result[key] = formattedValue
      }
    })

  return result
}

const validateEnv = (env) => {
  const isEnvExist = fs.existsSync(localEnv)

  if (!isEnvExist) {
    throw new Error(`Create "${localEnvFileName}" file`)
  }

  const envList = getEnvList(localEnv)
  const errors = []

  const isVaultMainnetAvailable = isAddress(envList.NEXT_PUBLIC_MAINNET_VAULT_ADDRESS)
  const isVaultGnosisAvailable = isAddress(envList.NEXT_PUBLIC_GNOSIS_VAULT_ADDRESS)
  const isVaultChiadoAvailable = isAddress(envList.NEXT_PUBLIC_CHIADO_VAULT_ADDRESS)
  const isVaultAddressMissed = !isVaultMainnetAvailable && !isVaultGnosisAvailable && !isVaultChiadoAvailable

  if (isVaultMainnetAvailable && !envList.NEXT_PUBLIC_MAINNET_NETWORK_URL) {
    errors.push('Add a valid network URL to the "NEXT_PUBLIC_MAINNET_NETWORK_URL" variable')
  }
  if ((isVaultGnosisAvailable || isVaultChiadoAvailable) && !envList.NEXT_PUBLIC_GNOSIS_NETWORK_URL) {
    errors.push('Add a valid network URL to the "NEXT_PUBLIC_GNOSIS_NETWORK_URL" variable')
  }
  if (isVaultAddressMissed) {
    errors.push('Add a valid vault address to at least one of the following networks: "NEXT_PUBLIC_MAINNET_VAULT_ADDRESS", "NEXT_PUBLIC_GNOSIS_VAULT_ADDRESS", or "NEXT_PUBLIC_CHIADO_VAULT_ADDRESS"')
  }
  if (!envList.NEXT_PUBLIC_LOCALES?.length) {
    errors.push(`Add at least one locale to the "NEXT_PUBLIC_LOCALES" variable. Available locales: ${availableLocales.join(', ')}`)
  }
  if (!envList.NEXT_PUBLIC_CURRENCIES?.length) {
    errors.push(`Add at least one currency to the "NEXT_PUBLIC_CURRENCIES" variable. Available currencies: ${availableCurrencies.join(', ')}`)
  }

  try {
    new URL(`https://${envList.NEXT_PUBLIC_OWNER_DOMAIN}`)
  }
  catch {
    errors.push('Add a valid domain to the "NEXT_PUBLIC_OWNER_DOMAIN" variable, e.g., "example.com"')
  }

  if (errors.length) {
    throw new Error(`\n- ${errors.join('\n- ')}`)
  }
}

validateEnv()
