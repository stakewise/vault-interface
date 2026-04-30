/* eslint-env browser */
/* eslint-disable no-undef */
(function() {
  const chains = __MOCK_CHAINS_JSON__
  const defaultChainIdHex = '__MOCK_DEFAULT_CHAIN_ID_HEX__'
  const address = '__MOCK_ADDRESS__'
  let currentChainIdHex = defaultChainIdHex

  const rpcTimeoutMs = 30_000
  const pendingTxMaxAttempts = 300 // 100ms * 300 = 30s total budget

  const listeners = Object.create(null)

  const emit = (event, ...args) => {
    (listeners[event] || []).slice().forEach((cb) => {
      try {
        cb(...args)
      }
      catch (error) {
        console.error(`[e2e wallet] listener for "${event}" threw:`, error)
      }
    })
  }

  const on = (event, cb) => {
    listeners[event] = listeners[event] || []
    listeners[event].push(cb)
  }

  const removeListener = (event, cb) => {
    const arr = listeners[event] || []
    const index = arr.indexOf(cb)

    if (index !== -1) {
      arr.splice(index, 1)
    }
  }

  const blockIdToTag = (blockId) => {
    if (blockId == null) {
      return 'latest'
    }

    if (typeof blockId === 'string') {
      return blockId
    }

    return `0x${blockId.toString(16)}`
  }

  let rpcId = 0

  async function rpcCall(method, params) {
    const url = (chains[currentChainIdHex] || chains[defaultChainIdHex]).rpcUrl
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), rpcTimeoutMs)

    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: ++rpcId,
          method,
          params: params || [],
        }),
        signal: controller.signal,
      })
    }
    catch (error) {
      const isTimeout = error?.name === 'AbortError'
      const reason = isTimeout
        ? `timed out after ${rpcTimeoutMs}ms`
        : error?.message || 'network failure'

      throw new Error(`RPC ${method} ${reason} [${url}]`)
    }
    finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      throw new Error(`RPC ${method} HTTP ${response.status} [${url}]`)
    }

    let json
    try {
      json = await response.json()
    }
    catch (error) {
      throw new Error(`RPC ${method} invalid JSON: ${error.message} [${url}]`)
    }

    if (json.error) {
      const err = new Error(`RPC ${method}: ${json.error.message || 'error'}`)
      err.code = json.error.code
      err.data = json.error.data
      throw err
    }

    return json.result
  }

  const mineImmediately = async (label) => {
    try {
      await rpcCall('anvil_mine', [ '0x1' ])
    }
    catch (error) {
      console.warn(`[e2e wallet] anvil_mine after ${label} failed:`, error?.message || error)
    }
  }

  const compatProvider = {
    get connection() {
      return { url: chains[currentChainIdHex].rpcUrl }
    },

    async getBlock(blockId) {
      return rpcCall('eth_getBlockByNumber', [ blockIdToTag(blockId), false ])
    },

    async getFeeData() {
      const [ gasPrice, block ] = await Promise.all([
        rpcCall('eth_gasPrice', []),
        rpcCall('eth_getBlockByNumber', [ 'latest', false ]),
      ])

      return {
        gasPrice,
        maxFeePerGas: block?.baseFeePerGas,
        maxPriorityFeePerGas: '0x3b9aca00',
      }
    },

    async getNetwork() {
      const chainId = await rpcCall('eth_chainId', [])

      return {
        chainId: parseInt(chainId, 16),
        name: chains[chainId]?.name || 'unknown',
      }
    },

    async getTransaction(txHash, attempt = 0) {
      const tx = await rpcCall('eth_getTransactionByHash', [ txHash ])

      if (tx?.blockNumber) {
        const receipt = await rpcCall('eth_getTransactionReceipt', [ txHash ])

        return {
          ...tx,
          gasUsed: receipt?.gasUsed || tx.gas,
          cumulativeGasUsed: receipt?.cumulativeGasUsed || tx.gas,
          logs: receipt?.logs || [],
          status: receipt?.status || '0x1',
        }
      }

      if (attempt >= pendingTxMaxAttempts) {
        throw new Error(`getTransaction: ${txHash} not mined after ${pendingTxMaxAttempts * 100}ms`)
      }

      await new Promise((resolve) => setTimeout(resolve, 100))

      return compatProvider.getTransaction(txHash, attempt + 1)
    },
  }

  const provider = {
    isMetaMask: true,
    isConnected: () => true,
    providers: [],

    get chainId() {
      return currentChainIdHex
    },
    get selectedAddress() {
      return address
    },
    get networkVersion() {
      return String(parseInt(currentChainIdHex, 16))
    },

    signer: { address },

    provider: compatProvider,

    on,
    removeListener,

    async request(args) {
      const method = args?.method
      const params = args?.params || []

      switch (method) {
        case 'eth_accounts':
        case 'eth_requestAccounts':
          return [ address ]

        case 'eth_chainId':
          return currentChainIdHex

        case 'net_version':
          return String(parseInt(currentChainIdHex, 16))

        // skip 4902 check for gnosis tests
        case 'wallet_switchEthereumChain': {
          currentChainIdHex = params[0]?.chainId
          emit('chainChanged', currentChainIdHex)

          return null
        }

        case 'wallet_addEthereumChain': {
          return null
        }

        case 'eth_sendTransaction': {
          const tx = { ...params[0] }

          if (!tx.from) {
            tx.from = address
          }

          const hash = await rpcCall('eth_sendTransaction', [ tx ])

          await mineImmediately('eth_sendTransaction')

          return hash
        }

        case 'eth_sendRawTransaction': {
          const hash = await rpcCall('eth_sendRawTransaction', params)

          await mineImmediately('eth_sendRawTransaction')

          return hash
        }

        case 'personal_sign': {
          const [ message, addr ] = params

          return window.__sw_e2e_personalSign(addr || address, message)
        }

        case 'eth_sign': {
          const [ addr, message ] = params

          return window.__sw_e2e_personalSign(addr || address, message)
        }

        case 'eth_signTypedData':
        case 'eth_signTypedData_v1': {
          throw new Error(`${method} is not supported - use eth_signTypedData_v4`)
        }

        case 'eth_signTypedData_v3':
        case 'eth_signTypedData_v4': {
          const [ addr, data ] = params

          return window.__sw_e2e_signTypedData(addr || address, data, method)
        }

        default:
          return rpcCall(method, params)
      }
    },

    send(method, params) {
      if (typeof method === 'string') {
        return provider.request({ method, params })
      }

      return provider.sendAsync(method, params)
    },

    sendAsync(payload, callback) {
      provider.request({ method: payload.method, params: payload.params })
        .then((result) => callback(null, { id: payload.id, jsonrpc: '2.0', result }))
        .catch((error) => callback(error, null))
    },
  }

  window.ethereum = provider

  window.dispatchEvent(new Event('ethereum#initialized'))
})()
