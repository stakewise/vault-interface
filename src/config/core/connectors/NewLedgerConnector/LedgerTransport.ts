import {
  DiscoveredDevice,
  DeviceManagementKit,
  DeviceManagementKitBuilder,
} from '@ledgerhq/device-management-kit'
import {
  SignerEthBuilder,
} from '@ledgerhq/device-signer-kit-ethereum'
import { webHidTransportFactory, webHidIdentifier } from '@ledgerhq/device-transport-kit-web-hid'
import { webBleTransportFactory, webBleIdentifier } from '@ledgerhq/device-transport-kit-web-ble'

import Signer from './Signer'

import { Transport, ProviderInput } from './types'


class LedgerTransport {
  #dmk: DeviceManagementKit
  #transport: Transport = 'usb'
  #sessionId: string | null = null
  #signer: Signer | null = null
  #onError?: () => void

  constructor(values: ProviderInput) {
    const { transport, onError } = values

    this.#onError = onError
    this.#transport = transport

    this.#dmk = new DeviceManagementKitBuilder()
      .addTransport(webHidTransportFactory)
      .addTransport(webBleTransportFactory)
      .build()
  }

  getAvailableDevice(): Promise<DiscoveredDevice | null> {
    return new Promise((resolve) => {
      const transport = this.#transport === 'usb' ? webHidIdentifier : webBleIdentifier

      const devicesSubscription = this.#dmk.listenToAvailableDevices({ transport }).subscribe((devices) => {
        if (devices.length) {
          devicesSubscription.unsubscribe()
          resolve(devices[0])
        }
      })

      setTimeout(() => {
        devicesSubscription.unsubscribe()
        resolve(null)
      }, 500)
    })
  }

  async getDevice(): Promise<DiscoveredDevice> {
    const availableDevice = await this.getAvailableDevice()

    if (availableDevice) {
      return availableDevice
    }

    return new Promise((resolve, reject) => {
      const transport = this.#transport === 'usb' ? webHidIdentifier : webBleIdentifier

      const discoverySubscription = this.#dmk.startDiscovering({ transport }).subscribe({
        next: async (device) => {
          discoverySubscription.unsubscribe()
          resolve(device)
        },
        error: (error) => {
          discoverySubscription.unsubscribe()
          reject(error?.originalError || error)
        },
      })
    })
  }

  async getAccount(path?: string) {
    if (this.#signer === null) {
      throw new Error('Session not found')
    }

    return this.#signer.getAddress(path || `44'/60'/0'/0/0`)
  }

  async connectLedger(method?: (signer: Signer) => Promise<any>) {
    if (!this.#sessionId) {
      try {
        const device = await this.getDevice()

        this.#sessionId = await this.#dmk.connect({ device })

        const observableSigner = new SignerEthBuilder({
          dmk: this.#dmk,
          sessionId: this.#sessionId,
          originToken: 'StakeWise',
        })
          .build()

        this.#signer = new Signer({ observableSigner })
      }
      catch {
        if (typeof this.#onError === 'function') {
          this.#onError()
        }
      }
    }

    if (typeof method === 'function' && this.#signer !== null) {
      return method(this.#signer)
    }

    return ''
  }

  deactivate() {
    this.#sessionId = null
  }
}


export default LedgerTransport
