import {
  SignerEthBuilder,
  SignTypedDataDAOutput,
  SignTransactionDAOutput,
  SignPersonalMessageDAOutput,
} from '@ledgerhq/device-signer-kit-ethereum'

import toPromise from './toPromise'


type ObservableSigner = ReturnType<SignerEthBuilder['build']>
type MethodParams<T extends keyof ObservableSigner> = Parameters<ObservableSigner[T]>

type TypedData = MethodParams<'signTypedData'>[1]
type MessageOptions = MethodParams<'signMessage'>[2]
type AddressOptions = MethodParams<'getAddress'>[1]
type TypedDataOptions = MethodParams<'signTypedData'>[2]
type TransactionOptions = MethodParams<'signTransaction'>[2]

type Input = {
  observableSigner: ObservableSigner
}

class Signer {
  #signer: ObservableSigner

  constructor({ observableSigner }: Input) {
    this.#signer = observableSigner
  }

  signTransaction(derivationPath: string, transaction: Uint8Array, options?: TransactionOptions) {
    return toPromise<SignTransactionDAOutput>(this.#signer.signTransaction(derivationPath, transaction, options))
  }

  signMessage(derivationPath: string, message: string | Uint8Array, options?: MessageOptions) {
    return toPromise<SignPersonalMessageDAOutput>(this.#signer.signMessage(derivationPath, message, options))
  }

  signTypedData(derivationPath: string, typedData: TypedData, options?: TypedDataOptions) {
    return toPromise<SignTypedDataDAOutput>(this.#signer.signTypedData(derivationPath, typedData, options))
  }

  getAddress(derivationPath: string, options?: AddressOptions): Promise<string> {
    return toPromise<{ address: string }>(this.#signer.getAddress(derivationPath, options))
      .then(({ address }) => address)
  }
}


export default Signer
