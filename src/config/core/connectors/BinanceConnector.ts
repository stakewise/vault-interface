'use client'
import { getProvider } from '@binance/w3w-ethereum-provider'
import EventAggregator from 'modules/event-aggregator'
import { AbstractProvider } from 'ethers'
import { Network } from 'sdk'


export type Input = {
  chainId: Network
  networks: ConfigProvider.Networks
}

type Provider = ReturnType<typeof getProvider>

const languages: Record<Intl.LanguagesKeys, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-PT',
  zh: 'zh-CN',
}

class BinanceConnector extends AbstractProvider {
  events: EventAggregator
  private chainId?: number
  private networks: ConfigProvider.Networks
  private account: string | null = null
  private providerInstance?: Provider

  constructor({ chainId, networks }: Input) {
    super()

    this.chainId = chainId
    this.networks = networks
    this.events = new EventAggregator()
  }

  async activate(networkId: string, locale: Intl.LanguagesKeys) {
    const chainId = this.networks.chainById[networkId]

    const rpc = Object.values(this.networks.configs).reduce((acc, config) => ({
      ...acc,
      [config.chainId]: Array.isArray(config.rpc) ? config.rpc[0] : config.rpc,
    }), {} as Record<string, string>)

    const providerInstance = getProvider({
      lng: languages[locale],
      showQrCodeModal: true,
      chainId,
      rpc,
    })

    this.chainId = chainId
    this.providerInstance = providerInstance

    const accounts = await providerInstance.enable()

    this.providerInstance.on('accountsChanged', (acc: string[]) => {
      this.events.dispatch('change', {
        account: acc[0],
      })
    })

    this.providerInstance.on('chainChanged', (chainId: number) => {
      this.events.dispatch('change', {
        chainId,
      })
    })

    this.providerInstance.on('disconnect', () => {
      this.events.dispatch('disconnect')
    })

    return {
      provider: this.providerInstance,
      chainId: this.chainId,
      account: accounts[0],
    }
  }

  deactivate() {
    if (this.providerInstance) {
      this.providerInstance.disconnect()
    }

    super.destroy()
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

  async changeChainId(chainId: Network) {
    if (!this.providerInstance) {
      console.error('Empty provider')

      return
    }

    const networkId = this.networks.idByChain[chainId]
    const { hexadecimalChainId } = this.networks.configs[networkId]

    try {
      await this.providerInstance.request({
        method: "wallet_switchEthereumChain",
        params: [
          { chainId: hexadecimalChainId },
        ],
      })

      this.chainId = chainId
    }
    catch {}
  }

  async getAccount(force = false) {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    if (!this.account || force) {
      const accounts = await this.providerInstance.request({
        method: 'eth_accounts',
      })

      this.account = accounts[0]
    }

    return this.account
  }

  get provider(): any {
    if (!this.providerInstance) {
      throw new Error('Empty providerInstance')
    }

    return this.providerInstance
  }
}


export default BinanceConnector
