import pc from 'picocolors'
import prompts from 'prompts'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

import {
  defaultCsp,
  networkLabels,
  localeChoices,
  promptOptions,
  networkChoices,
  currencyChoices,
} from '../constants'
import type { Network, Config } from '../types'
import { ask, log, isUrl, isAddress, isHexColor } from '../helpers'


const initialRpc = {
  hoodi: 'https://ethereum-hoodi-rpc.publicnode.com',
  mainnet: 'https://ethereum-rpc.publicnode.com',
  gnosis: 'https://rpc.gnosischain.com',
} as const

const collectAnswers = async (): Promise<Config> => {
  const { projectName } = await ask<'projectName'>({
    type: 'text',
    name: 'projectName',
    message: 'Project folder name',
    initial: 'vault-interface',
    validate: (value: string) => (value.trim() ? true : 'Required'),
  })

  const { title } = await ask<'title'>({
    type: 'text',
    name: 'title',
    message: 'Site title (e.g. StakeWise)',
    validate: (value: string) => (value.trim() ? true : 'Required'),
  })

  const trimmedName = String(projectName).trim()
  const targetDir = resolve(process.cwd(), trimmedName)

  if (existsSync(targetDir)) {
    log(pc.red(`Folder "${trimmedName}" already exists.`))
    process.exit(1)
  }

  const { customizeTheme } = await ask<'customizeTheme'>({
    type: 'toggle',
    name: 'customizeTheme',
    message: 'Customize primary brand color?',
    initial: false,
    active: 'yes',
    inactive: 'no',
  }) as { customizeTheme: boolean }

  let lightPrimary = ''
  let darkPrimary = ''

  if (customizeTheme) {
    const lightRes = await ask<'color'>({
      type: 'text',
      name: 'color',
      message: 'Primary color for light theme (e.g. #3a8eea)',
      validate: (value: string) => isHexColor(value)
        ? true
        : 'Must be #rrggbb (7 chars, no alpha)',
    })

    lightPrimary = String(lightRes.color).trim().toLowerCase()

    const darkRes = await ask<'color'>({
      type: 'text',
      name: 'color',
      message: 'Primary color for dark theme (e.g. #5c87f6)',
      validate: (value: string) => isHexColor(value)
        ? true
        : 'Must be #rrggbb (7 chars, no alpha)',
    })

    darkPrimary = String(darkRes.color).trim().toLowerCase()
  }

  const { networks } = await ask<'networks'>({
    type: 'multiselect',
    name: 'networks',
    message: 'Which networks should be supported?',
    choices: networkChoices,
    min: 1,
    instructions: false,
    hint: 'Space to toggle, Enter to confirm',
  }) as { networks: Network[] }

  const vaultAddresses: Partial<Record<Network, string>> = {}

  for (const network of networks) {
    const { address } = await ask<'address'>({
      type: 'text',
      name: 'address',
      message: `Vault address for ${networkLabels[network]}`,
      validate: (value: string) => isAddress(value)
        ? true
        : 'Must be a valid 0x address (42 chars)',
    })

    vaultAddresses[network] = String(address).trim()
  }

  const rpcUrls: Partial<Record<Network, string>> = {}

  for (const network of networks) {
    const { url } = await ask<'url'>({
      type: 'text',
      name: 'url',
      message: `RPC URL for ${networkLabels[network]}`,
      initial: initialRpc[network],
      validate: (value: string) => isUrl(value)
        ? true
        : 'Must be an http(s) URL',
    })

    rpcUrls[network] = String(url).trim()
  }

  const fallbackUrls: Partial<Record<Network, string>> = {}

  for (const network of networks) {
    const { url } = await ask<'url'>({
      type: 'text',
      name: 'url',
      message: `Fallback RPC URL for ${networkLabels[network]} (optional)`,
      validate: (value: string) => (!value || isUrl(value))
        ? true
        : 'Must be an http(s) URL',
    })

    fallbackUrls[network] = String(url || '').trim()
  }

  const rest = await prompts(
    [
      {
        type: 'text',
        name: 'ownerDomain',
        message: 'Your site domain (e.g. app.example.io)',
        validate: (value: string) => value.trim()
          ? true
          : 'Required',
      },
      {
        type: 'text',
        name: 'xAccount',
        message: 'X (Twitter) account, e.g. @yourname (optional)',
      },
      {
        type: 'text',
        name: 'walletConnectId',
        message: 'WalletConnect Project ID (optional)',
      },
      {
        type: 'text',
        name: 'referrer',
        message: 'Referrer address (optional)',
        validate: (value: string) => (!value || isAddress(value))
          ? true
          : 'Must be a valid 0x address',
      },
      {
        type: 'multiselect',
        name: 'locales',
        message: 'Supported languages',
        choices: localeChoices.map((choice) => ({ ...choice, selected: true })),
        min: 1,
        instructions: false,
        hint: 'Space to toggle, Enter to confirm',
      },
      {
        type: 'multiselect',
        name: 'currencies',
        message: 'Supported currencies',
        choices: currencyChoices.map((choice) => ({ ...choice, selected: true })),
        min: 1,
        instructions: false,
        hint: 'Space to toggle, Enter to confirm',
      },
      {
        type: 'text',
        name: 'csp',
        message: 'Content-Security-Policy directives',
        initial: defaultCsp,
      },
      {
        type: 'toggle',
        name: 'installDeps',
        message: 'Install npm dependencies after creating?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: 'toggle',
        name: 'deployVercel',
        message: 'Deploy to Vercel after install?',
        initial: false,
        active: 'yes',
        inactive: 'no',
      },
    ],
    promptOptions
  ) as Pick<
    Config,
    'csp'
    | 'locales'
    | 'xAccount'
    | 'referrer'
    | 'currencies'
    | 'ownerDomain'
    | 'installDeps'
    | 'deployVercel'
    | 'walletConnectId'
  >

  return {
    title,
    rpcUrls,
    targetDir,
    networks,
    darkPrimary,
    fallbackUrls,
    lightPrimary,
    csp: rest.csp,
    vaultAddresses,
    customizeTheme,
    locales: rest.locales,
    projectName: trimmedName,
    currencies: rest.currencies,
    xAccount: rest.xAccount || '',
    referrer: rest.referrer || '',
    ownerDomain: rest.ownerDomain,
    installDeps: rest.installDeps,
    deployVercel: rest.deployVercel,
    walletConnectId: rest.walletConnectId || '',
  }
}


export default collectAnswers
