import fs from 'fs'
import path from 'path'
import { Wallet, JsonRpcProvider, getBytes, isHexString, parseEther, toBeHex } from 'ethers'
import type { Page } from '@playwright/test'

import * as constants from '../../../constants'
import { impersonate } from './impersonate'
import { chains, getAvailableChains } from '../chains'
import type { SupportedNetwork } from '../chains'


const providerScriptPath = path.join(__dirname, 'eip1193-provider.js')
const providerScriptTemplate = fs.readFileSync(providerScriptPath, 'utf-8')

const initialEthHex = toBeHex(parseEther('10000'))

const cookieScript = `document.cookie = '${constants.cookieNames.e2e}=true'`

type InitProviderInput = {
  page: Page
  chainId: SupportedNetwork
  address?: string
  privateKey?: string
}

const buildProviderScript = (address: string, chainId: SupportedNetwork) => {
  const chainMap = getAvailableChains()

  return providerScriptTemplate
    .replace('__MOCK_CHAINS_JSON__', () => JSON.stringify(chainMap))
    .replace('__MOCK_DEFAULT_CHAIN_ID_HEX__', () => chains[chainId].hexadecimalChainId)
    .replace('__MOCK_ADDRESS__', () => address)
}

const exposeSigner = async (page: Page, privateKey: string) => {
  const wallet = new Wallet(privateKey)

  const exposals: Array<[string, (...args: any[]) => Promise<string>]> = [
    [
      '__sw_e2e_signTypedData',
      async (_address: string, data: string) => {
        const { domain, types, message } = JSON.parse(data)
        const { EIP712Domain: _, ...cleanTypes } = types

        return wallet.signTypedData(domain, cleanTypes, message)
      },
    ],
    [
      '__sw_e2e_personalSign',
      async (_address: string, message: string) => {
        const payload = isHexString(message) ? getBytes(message) : message

        return wallet.signMessage(payload)
      },
    ],
  ]

  for (const [ name, fn ] of exposals) {
    try {
      await page.exposeFunction(name, fn)
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      if (!/already registered/i.test(errorMessage)) {
        throw error
      }
    }
  }
}

const impersonateOnChain = async (rpcUrl: string, address: string) => {
  const rpc = new JsonRpcProvider(rpcUrl)

  try {
    await impersonate({ rpc, rpcUrl, address })
    await rpc.send('anvil_setBalance', [ address, initialEthHex ])
  }
  finally {
    rpc.destroy()
  }
}

export const initProvider = async (input: InitProviderInput) => {
  const { page, chainId } = input

  if (!chains[chainId]) {
    throw new Error(`Unknown chainId: ${chainId}`)
  }

  let address = input.address

  if (!address) {
    if (!input.privateKey) {
      throw new Error('initProvider: either address or privateKey must be provided')
    }

    address = new Wallet(input.privateKey).address
  }

  const script = buildProviderScript(address, chainId)

  const impersonationTasks = Object.values(chains).map((entry) => (
    impersonateOnChain(entry.rpcUrl, address)
  ))

  const tasks = [ ...impersonationTasks ]

  if (input.privateKey) {
    tasks.push(exposeSigner(page, input.privateKey))
  }

  await Promise.all(tasks)

  await page.addInitScript(cookieScript)
  await page.addInitScript(script)

  return { address }
}
