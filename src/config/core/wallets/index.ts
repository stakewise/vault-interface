'use client'
import ledger from './ledger'
import binance from './binance'
import coinbase from './coinbase'
import gnosisSafe from './gnosisSafe'
import monitorAddress from './monitorAddress'
import { walletConnect } from './walletConnect'
import { dAppBrowser, ledgerLive } from './injected'
import { getAutoDetectedWallets } from './injected/helpers'


type WalletConfig = typeof staticWallets[keyof typeof staticWallets]

type Wallets = Record<string, WalletConfig>

// ATTN The order here is equal to the order in the UI not counting filters
const staticWallets = {
  // Inject wallets with custom logic
  ledgerLive,
  dAppBrowser,

  walletConnect,
  ledger,
  binance,
  coinbase,
  gnosisSafe,
  monitorAddress,
}

// EIP-6963 detected wallets (MetaMask, Rabby, OKX, etc.)
const autoDetected = getAutoDetectedWallets(staticWallets)

const detectedWallets: Wallets = {}

for (const wallet of autoDetected) {
  detectedWallets[wallet.id] = wallet as any
}

const wallets: Wallets = { ...detectedWallets, ...staticWallets }


export default wallets
