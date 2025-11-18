import { Network , localStorage } from 'sdk'
import { AbstractProvider } from 'ethers'
import { localStorageNames } from 'helpers/constants'
import EventAggregator from 'modules/event-aggregator'

import { PathTypes } from './enum'
import { Transport } from './types'
import LedgerProvider from './LedgerProvider'
import networks from '../../config/util/networks'


export type Input = {
  chainId: Network
  transport?: Transport
  params: Record<number, {
    chainId: number
    name: string
    url: string
  }>
  onError?: () => void
}

class LedgerConnector extends AbstractProvider {
  private chainId?: number
  events: EventAggregator
  private params: Input['params']
  private transport: Transport = 'usb'
  private account: string | null = null
  private providerInstance?: LedgerProvider
  private onError?: () => void | null

  constructor({ params, transport, chainId, onError }: Input) {
    super()

    this.params = params
    this.chainId = chainId
    this.transport = transport || 'usb'
    this.events = new EventAggregator()

    this.onError = onError
    this.#initActiveAccount()
  }

  get pathType(): PathTypes {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    return this.providerInstance.pathType
  }

  async activate(networkId: NetworkIds) {
    const chainId = networks.chainById[networkId]
    const { url } = this.params[chainId]

    const providerInstance = this.#initProvider(chainId, url)

    this.chainId = chainId
    this.providerInstance = providerInstance

    const account = await this.getAccount()

    return {
      provider: this.providerInstance,
      chainId: this.chainId,
      account,
    }
  }

  deactivate() {
    super.destroy()
    this.providerInstance?.deactivate()
  }

  async getProvider() {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    return this.providerInstance
  }

  async getChainId() {
    if (!this.chainId) {
      throw new Error('Empty chainId')
    }

    return this.chainId
  }

  async changeChainId(chainId: number) {
    const { url } = this.params[chainId]

    if (!url) {
      console.error(`Invalid rpc url for chainId: ${chainId}`)

      return
    }

    if (!this.providerInstance) {
      console.error('Invalid provider instance')

      return
    }

    this.providerInstance.setChain({
      chainId,
      rpcUrl: url,
    })

    this.chainId = chainId
  }

  async getAccount(force = false) {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    if (!this.account || force) {
      const accounts = await this.getAccounts(this.providerInstance.accountIndex, 1)

      this.account = accounts[0]
    }

    return this.account
  }

  async setActiveAccount(index: number) {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    if (this.providerInstance.accountIndex !== index) {
      this.providerInstance.accountIndex = index
      const account = await this.getAccount(true)

      this.events.dispatch('change', {
        provider: this.provider,
        chainId: this.chainId,
        account,
      })
    }
  }

  async getAccounts(from = 0, limit = 5) {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    return this.providerInstance.getAccounts(from, limit)
  }

  async setPathType(type: PathTypes) {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    const pathType = this.providerInstance.pathType

    if (pathType === type) {
      return
    }

    this.providerInstance.pathType = type
    const account = await this.getAccount(true)

    this.events.dispatch('change', {
      provider: this.provider,
      chainId: this.chainId,
      account,
    })
  }

  get provider(): any {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    return this.providerInstance
  }

  #initProvider(chainId: number, url: string) {
    const providerInstance = new LedgerProvider({
      transport: this.transport,
      onError: this.onError,
      rpcUrl: url,
      chainId,
    })

    this.providerInstance = providerInstance

    return providerInstance
  }

  async #initActiveAccount() {
    const localStorageName = localStorageNames.ledgerSelectedAccount
    const savedLedgerAccount = localStorage.getItem<LocalStorageData.LedgerSelectedAccount>(localStorageName)

    if (savedLedgerAccount) {
      const { index, pathType } = savedLedgerAccount

      const promises = [
        this.setActiveAccount(index),
      ]

      if (pathType) {
        promises.push(this.setPathType(pathType))
      }

      await Promise.all(promises)
    }
  }
}


export default LedgerConnector
