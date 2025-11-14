import { Semaphore } from 'async-mutex'
import AppEth from '@ledgerhq/hw-app-eth'
import TransportUSB from '@ledgerhq/hw-transport-webusb'
import TransportHID from '@ledgerhq/hw-transport-webhid'
import TransportBLE from '@ledgerhq/hw-transport-web-ble'

import { Transport, ProviderInput } from './types'

// ATTN Requests to the device can only be sequential. Do not use Promise.all() for appEth requests

const semaphore = new Semaphore(1)

class LedgerTransport {
  #transport: Transport = 'usb'
  #connection: any | null = null
  #bleEthApp: AppEth | null = null
  #onError?: () => void

  constructor(values: ProviderInput) {
    const { transport, onError } = values

    this.#onError = onError
    this.#transport = transport
  }

  async #connectLedgerByUSB(method: (app: AppEth) => Promise<any>) {
    const [ _, release ] = await semaphore.acquire()

    try {
      const connection = await (
        'hid' in navigator
          ? TransportHID.create()
          : TransportUSB.create()
      )

      this.#connection = connection

      try {
        const app = new AppEth(connection)

        return await method(app)
      }
      catch (error) {
        console.log('Ledger USB error:', error)

        return Promise.reject(error)
      }
      finally {
        await connection.close()
      }
    }
    finally {
      release()
    }
  }

  async #connectLedgerByBLE(method: (app: AppEth) => Promise<any>) {
    const [ _, release ] = await semaphore.acquire()

    try {
      if (this.#bleEthApp) {
        return await method(this.#bleEthApp)
      }

      const connection = await TransportBLE.create(60_000)
      const app = new AppEth(connection)

      this.#bleEthApp = app
      this.#connection = connection

      return await method(app)
    }
    catch (error: any) {
      console.log('Ledger BLE error:', error)

      if (error.statusCode === 0x6985) {
        return Promise.reject('User rejected the transaction')
      }

      if (error.statusCode === 0x6983) {
        return Promise.reject('Ledger is locked')
      }

      if (error.statusCode === 0x650f) {
        return Promise.reject('Ledger Ethereum app is not opened')
      }

      if (typeof this.#onError === 'function') {
        this.#onError()
      }

      await this.#connection.close()
      this.#connection = null

      return Promise.reject(error)
    }
    finally {
      release()
    }
  }

  async connectLedger(method: (app: AppEth) => Promise<any>) {
    if (this.#transport === 'usb') {
      return this.#connectLedgerByUSB(method)
    }

    if (this.#transport === 'ble') {
      return this.#connectLedgerByBLE(method)
    }
  }

  deactivate() {
    this.#bleEthApp = null
    return this.#connection?.close()
  }
}


export default LedgerTransport
