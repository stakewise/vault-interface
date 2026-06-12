import { configs, Network } from 'sdk'
import prefix0x from 'helpers/methods/prefix0x'
import { Signature, Transaction, isAddress } from 'ethers'
import type { TransactionLike, Eip1193Provider } from 'ethers'
import { hexaStringToBuffer } from '@ledgerhq/device-management-kit'

import Signer from './Signer'
import { PathTypes } from './enum'
import LedgerTransport from './LedgerTransport'
import { Payload, TxParams, JSONRPCResponsePayload, ProviderInput } from './types'


class LedgerProvider extends LedgerTransport implements Eip1193Provider {
  #rpcUrl: string
  #chainId: Network
  #accountIndex: number = 0
  #pathType: PathTypes = PathTypes.LIVE

  // More info here: https://blog.ledger.com/understanding-crypto-addresses-and-derivation-paths/
  private _paths: Record<PathTypes, string> = {
    [PathTypes.LIVE]: "44'/60'/{index}'/0/0", // (default)
    [PathTypes.BIP44]: "44'/60'/0'/0/{index}",
    [PathTypes.LEGACY]: "44'/60'/0'/{index}",
  }

  #derivationPath = this.#getDerivationPath()

  constructor(values: ProviderInput) {
    super(values)
    const { rpcUrl, chainId } = values

    this.#rpcUrl = rpcUrl
    this.#chainId = chainId
  }

  get accountIndex() {
    return this.#accountIndex
  }

  set accountIndex(value) {
    this.#accountIndex = value ?? 0
    this.#derivationPath = this.#getDerivationPath()
  }

  get pathType() {
    return this.#pathType
  }

  set pathType(type: PathTypes) {
    this.#pathType = type
    this.#derivationPath = this.#getDerivationPath()
  }

  setChain(values: Pick<ProviderInput, 'chainId' | 'rpcUrl'>) {
    const { rpcUrl, chainId } = values

    this.#rpcUrl = rpcUrl
    this.#chainId = chainId
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
      return this.getAccounts()
    }

    if (method === 'eth_signTypedData_v4') {
      return this.#requestEIP712(payload)
    }

    if (method === 'eth_sendTransaction') {
      const txParams = params[0]
      const sender = txParams.from

      if (sender === undefined || !isAddress(sender)) {
        throw new Error('Invalid or missing address')
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
      let data: any

      if (method === 'eth_sign') {
        [ , data ] = params
      }
      else {
        [ data ] = params
      }

      const result = await this.signPersonalMessage(data)

      return result
    }

    if (method === 'eth_chainId') {
      const hexadecimalChainId = configs[this.#chainId].network.hexadecimalChainId

      const result = await this.jsonRpcRequest(payload)

      return result || hexadecimalChainId
    }

    return this.jsonRpcRequest(payload)
  }

  async signTransaction(txParams: TxParams) {
    return this.connectLedger(async (signer: Signer) => {
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

      const unsignedTx = Transaction.from(transaction).unsignedSerialized
      const rawTxHex = hexaStringToBuffer(unsignedTx)

      if (!rawTxHex) {
        throw new Error('Invalid transaction')
      }

      const address = await signer.getAddress(this.#derivationPath)
      const { r, s, v } = await signer.signTransaction(this.#derivationPath, rawTxHex)

      // Saves 1.5 bytes, which reduces the price of gas (EIP-2098)
      const compact = Signature.from({
        r,
        s,
        v,

        // There is no "from" field in the signature parameters, but if you add it,
        // then the number of field confirmations before the transaction is reduced
        // from 9 to 3 and the price of gas is reduced
        // @ts-ignore
        from: address,
      }).compactSerialized

      const signedTx = Transaction.from({
        ...transaction,
        signature: compact,
      }).serialized

      return signedTx
    })
  }

  async signPersonalMessage(data: string) {
    return this.connectLedger(async (signer: Signer) => {
      const formattedData = prefix0x.remove(data)

      const result = await signer.signMessage(this.#derivationPath, formattedData)

      return Signature.from(result).compactSerialized
    })
  }

  async getAccounts(from = 0, limit = 1) {
    const addresses: string[] = []

    for (let i = from; i < from + limit; i++) {
      const path = this.#getDerivationPath(i)
      const address = await this.getAccount(path)

      addresses.push(address as string)
    }

    return addresses
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
    const result = txParams

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

  async #requestEIP712(payload: Payload) {
    if (payload.params && payload.params.length < 2) {
      throw new Error('No second parameter in the array')
    }

    const typedData = JSON.parse(payload.params[1])

    return this.connectLedger(async (signer: Signer) => {
      // https://app.devicesdk.ledger-test.com/signers/ethereum (if you need to compare signatures)
      const result = await signer.signTypedData(this.#derivationPath, {
        types: typedData.types,
        domain: typedData.domain,
        message: typedData.message,
        primaryType: typedData.primaryType,
      })

      return Signature.from(result).compactSerialized
    })
  }

  #getDerivationPath(index: number = this.#accountIndex) {
    return this._paths[this.#pathType].replace('{index}', `${index}`)
  }

  #getRandomId(): number {
    const datePart = new Date().getTime() * Math.pow(10, 3)
    const extraPart = Math.floor(Math.random() * Math.pow(10, 3))

    return datePart + extraPart
  }
}


export default LedgerProvider
