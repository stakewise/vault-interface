import methods from 'sw-methods'
import { Semaphore } from 'async-mutex'
import AppEth from '@ledgerhq/hw-app-eth'
import TransportUSB from '@ledgerhq/hw-transport-webusb'
import TransportHID from '@ledgerhq/hw-transport-webhid'
import { Signature, Transaction, isAddress } from 'ethers'
import type { TransactionLike, Eip1193Provider } from 'ethers'

import { structHash } from './eip712'
import { Payload, TxParams, JSONRPCResponsePayload } from './types'

// ATTN Requests to the device can only be sequential. Do not use Promise.all() for appEth requests

const semaphore = new Semaphore(1)

export enum PathTypes {
  LEGACY = 'legacy',
  BIP44 = 'bip44',
  LIVE = 'live',
}

class LedgerProvider implements Eip1193Provider {
  #rpcUrl: string
  #chainId: number
  #accountIndex: number = 0
  #pathType: PathTypes = PathTypes.LIVE

  // More info here: https://blog.ledger.com/understanding-crypto-addresses-and-derivation-paths/
  private _paths: Record<PathTypes, string> = {
    [PathTypes.LIVE]: "m/44'/60'/{index}'/0/0", // (default)
    [PathTypes.BIP44]: "m/44'/60'/0'/0/{index}",
    [PathTypes.LEGACY]: "m/44'/60'/0'/{index}",
  }

  constructor(chainId: number, rpcUrl: string) {
    this.#rpcUrl = rpcUrl
    this.#chainId = chainId
  }

  get accountIndex() {
    return this.#accountIndex
  }

  set accountIndex(value) {
    this.#accountIndex = value ?? 0
  }

  get pathType() {
    return this.#pathType
  }

  set pathType(type: PathTypes) {
    this.#pathType = type
  }

  async jsonRpcRequest(payload: Payload): Promise<any> {
    const { method, params } = payload

    const body = {
      method,
      params,
      jsonrpc: '2.0',
      id: this.#getRandomId(),
    }

    const output = await fetch(this.#rpcUrl, {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const data = await output.json()

    return data.result
  }

  async request(payload: Payload): Promise<any> {
    const { method, params } = payload

    if (!Array.isArray(params)) {
      return this.jsonRpcRequest(payload)
    }

    if (method === 'eth_accounts') {
      const accounts = await this.getAccounts()

      return accounts
    }

    if (method === 'eth_signTypedData_v4') {
      return this.#requestEIP712(payload)
    }

    if (method === 'eth_sendTransaction') {
      const txParams = params[0]
      const sender = txParams.from

      if (sender === undefined || !isAddress(sender)) {
        throw new Error('Invalid ot missing address')
      }

      const data = await this.#fillMissingTxParams(txParams)
      const signedTx = await this.signTransaction(data)
      const response = await this.#sendRawTransaction(signedTx)

      return response
    }

    if (method === 'eth_signTransaction') {
      const txParams = params[0]

      const data = await this.#fillMissingTxParams(txParams)
      const signedTx = await this.signTransaction(data)

      return {
        raw: signedTx,
        tx: txParams,
      }
    }

    if (method === 'eth_sign' || method === 'personal_sign') {
      let data: any,
          address: string

      if (method === 'eth_sign') {
        [ address, data ] = params
      }
      else {
        [ data, address ] = params
      }

      const result = await this.signPersonalMessage(data)

      return result
    }

    return this.jsonRpcRequest(payload)
  }

  async signTransaction(txParams: TxParams) {
    return this.connectLedger(async (app: AppEth) => {
      const transaction: TransactionLike = {
        type: null,
        to: txParams.to,
        data: txParams.data,
        value: txParams.value,
        gasLimit: txParams.gas,
        gasPrice: txParams.gasPrice,

        // activated EIP-155
        chainId: this.#chainId,
      }

      if ('nonce' in txParams) {
        transaction.nonce = parseInt(txParams.nonce)
      }

      // EIP-2930
      if ('accessList' in txParams) {
        transaction.type = 1
        transaction.accessList = txParams.accessList
      }

      // EIP-1559
      if (txParams.maxFeePerGas || txParams.maxPriorityFeePerGas) {
        delete transaction.gasPrice // The parameter is not supported together with the EIP-1559

        transaction.type = 2
        transaction.maxFeePerGas = txParams.maxFeePerGas
        transaction.maxPriorityFeePerGas = txParams.maxPriorityFeePerGas
      }

      const path = this.#getDerivationPath()
      const unsignedTx = Transaction.from(transaction).unsignedSerialized
      const rawTxHex = methods.prefix0x.remove(unsignedTx)

      const address = await app.getAddress(path)
      const { r, s, v } = await app.signTransaction(path, rawTxHex)

      const signature = {
        r: methods.prefix0x.add(r),
        s: methods.prefix0x.add(s),
        v: parseInt(v),

        // There is no "from" field in the signature parameters, but if you add it,
        // then the number of field confirmations before the transaction is reduced
        // from 9 to 3 and the price of gas is reduced
        // @ts-ignore
        from: address,
      }

      // Saves 1.5 bytes, which reduces the price of gas (EIP-2098)
      const compact = Signature.from(signature).compactSerialized

      const signedTx = Transaction.from({
        ...transaction,
        signature: compact,
      }).serialized

      return signedTx
    })
  }

  async signPersonalMessage(data: string) {
    return this.connectLedger(async (app: AppEth) => {
      const path = this.#getDerivationPath()
      const formattedData = methods.prefix0x.remove(data)

      const result = await app.signPersonalMessage(path, formattedData)

      return this.#makeSignature(result)
    })
  }

  async getAccounts(from = 0, limit = 1) {
    return this.connectLedger(async (app: AppEth) => {
      const addresses = []

      for (let i = from; i < from + limit; i++) {
        const path = this.#getDerivationPath(i)
        const info = await app.getAddress(path, false, true)

        addresses.push(info.address)
      }

      return addresses
    })
  }

  async #sendRawTransaction(signedTx: string): Promise<JSONRPCResponsePayload> {
    const payload = {
      method: 'eth_sendRawTransaction',
      params: [ signedTx ],
    }

    const result = await this.jsonRpcRequest(payload)

    return result
  }

  async #fillMissingTxParams(txParams: TxParams): Promise<TxParams> {
    let result = txParams

    if (txParams.gasPrice === undefined) {
      const gasPrice = await this.jsonRpcRequest({
        method: 'eth_gasPrice',
        params: [],
      })

      result.gasPrice = gasPrice
    }

    if (txParams.nonce === undefined) {
      const nonce = await this.jsonRpcRequest({
        method: 'eth_getTransactionCount',
        params: [ txParams.from, 'pending' ],
      })

      result.nonce = nonce
    }

    if (txParams.gas === undefined) {
      const gas = await this.jsonRpcRequest({
        method: 'eth_estimateGas',
        params: [ txParams ],
      })

      result.gas = gas
    }

    return result
  }

  async #signEIP712Message(typedData: any) {
    return this.connectLedger(async (app: AppEth) => {
      const path = this.#getDerivationPath()

      const domain = structHash(typedData, 'EIP712Domain', typedData.domain)

      const message = structHash(
        typedData,
        typedData.primaryType,
        typedData.message
      )

      const result = await app.signEIP712HashedMessage(path, domain, message)

      return this.#makeSignature(result)
    })
  }

  async #requestEIP712(payload: Payload) {
    if (payload.params && payload.params.length < 2) {
      throw new Error('No second parameter in the array')
    }

    const typedData = JSON.parse(payload.params[1])
    const result = await this.#signEIP712Message(typedData)

    return result
  }

  #getDerivationPath(index: number = this.#accountIndex) {
    return this._paths[this.#pathType]
      .replace('{index}', `${index}`)
  }

  #makeSignature(values: { r: string, s: string, v: number }) {
    const { r, s } = values

    // https://www.npmjs.com/package/@ledgerhq/hw-app-eth#signeip712hashedmessage
    let v: string | number = values.v - 27
        v = v.toString(16)

    if (v.length < 2) {
      v = `0${v}`
    }

    return `0x${r}${s}${v}`
  }

  #getRandomId(): number {
    const datePart = new Date().getTime() * Math.pow(10, 3)
    const extraPart = Math.floor(Math.random() * Math.pow(10, 3))

    return datePart + extraPart
  }

  async connectLedger(method: (app: AppEth) => Promise<any>) {
    const [ _, release ] = await semaphore.acquire()

    try {
      const connection = await (
        'hid' in navigator
          ? TransportHID.create()
          : TransportUSB.create()
      )

      try {
        const app = new AppEth(connection)

        return await method(app)
      }
      finally {
        await connection.close()
      }
    }
    finally {
      release()
    }
  }
}


export default LedgerProvider
