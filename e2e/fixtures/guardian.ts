import fs from 'fs'
import path from 'path'
import { Wallet } from 'ethers'


const scriptPath = path.resolve(__dirname, '../../node_modules/@guardianui/test/dist/provider/provider.js')

const fixScript = `
  const updateBigNumber = (data) => {
    const result = {}
  
    Object.keys(data).forEach((key) => {
      const value = data[key]
  
      result[key] = value?._isBigNumber ? value.toHexString() : value
    })
  
    return result
  }
  
  // ATTN - this is a hack to fix the issue with update BigNumber, because getFeeData inwardly uses getBlock
  const originalGetFeeDataResult = window.ethereum.provider.getFeeData()
  window.ethereum.provider.getFeeData = () => {
    return originalGetFeeDataResult.then(updateBigNumber)
  }
  
  const originalGetBlock = window.ethereum.provider.getBlock
  window.ethereum.provider.getBlock = function () {
    return originalGetBlock.bind(this)(...arguments).then(updateBigNumber)
  }
  
  const originalGetNetwork = window.ethereum.provider.getNetwork
  window.ethereum.provider.getNetwork = function () {
    return originalGetNetwork.bind(this)(...arguments).then(updateBigNumber)
  }
  
  const originalGetTransaction = window.ethereum.provider.getTransaction

  window.ethereum.provider.getTransaction = function (txHash) {
    return originalGetTransaction.bind(this)(txHash)
      .then((tx) => {
        if (tx.blockNumber) {
          const updatedTx = updateBigNumber(tx)

          return {
            ...updatedTx,
            gasUsed: updatedTx.gasLimit,
            cumulativeGasUsed: updatedTx.gasLimit,
            logs: [],
            status: 1,
          }
        }

        return new Promise((resolve) => setTimeout(resolve, 100))
          .then(() => window.ethereum.provider.getTransaction(txHash))
      })
  }
`

const protectionScript = `
  (function() {
    let originalEthereum = null
    
    Object.defineProperty(window, 'ethereum', {
      get: function() {
        return originalEthereum
      },
      set: function(value) {
        if (!originalEthereum) {
          console.log('Setting window.ethereum:', value)
          
          originalEthereum = value
        } 
        else {
          console.warn('Blocked attempt to overwrite window.ethereum:', value)
        }
      },
      configurable: true
    })
  })()
`

const script = fs.readFileSync(scriptPath, 'utf-8')
  .replace('__GUARDIANUI_MOCK__RPC', "http://127.0.0.1:8545")
  .replace('__GUARDIANUI_MOCK__CHAIN_ID', '1')
  .concat(`setTimeout(() => {${fixScript}}, 0)`)

const cookieScript = `document.cookie = 'SW_e2e=true'`

export type GuardianFixture = {
  fixProvider: (privateKey?: string) => Promise<void>
}

const guardian: E2E.Fixture<GuardianFixture> = async ({ page }, use) => {

  const fixProvider = async (privateKey?: string) => {
    const currentKey = privateKey || Wallet.createRandom().privateKey
    const scriptWithWallet = script.replace('__GUARDIANUI_MOCK__PRIVATE_KEY', currentKey)

    await page.addInitScript(cookieScript)
    await page.addInitScript(protectionScript)
    await page.addInitScript(scriptWithWallet)
  }

  await use({
    fixProvider,
  })
}


export default guardian
