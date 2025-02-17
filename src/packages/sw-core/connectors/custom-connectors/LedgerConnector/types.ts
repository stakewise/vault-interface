export type Payload = {
  params: any[]
  method: string
}

export type JSONRPCResponseError = {
  message: string
  code: number
}

export type JSONRPCRequestPayload = {
  id: number
  params: any[]
  method: string
  jsonrpc: string
}

export type JSONRPCResponsePayload = {
  id: number
  result: any
  jsonrpc: string
  error?: JSONRPCResponseError
}

export type TxParams = {
  to: string
  gas: string
  from: string
  type?: number
  nonce: string
  data?: string
  value?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  accessList?: Array<{ address: string, storageKeys: string[] }>
}
