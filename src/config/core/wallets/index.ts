'use client'
import zenGo from './zenGo'
import ledger from './ledger'
import binance from './binance'
import coinbase from './coinbase'
import gnosisSafe from './gnosisSafe'
import walletConnect from './walletConnect'
import monitorAddress from './monitorAddress'
import { braveWallet, dAppBrowser, trustWallet, metaMask, rabby, taho, okx, ledgerLive } from './injected'


// ATTN The order here is equal to the order in the UI not counting filters
const wallets = {
  // Inject wallets
  metaMask,
  rabby,
  braveWallet,
  trustWallet,
  dAppBrowser,
  okx,
  taho,
  ledgerLive,

  walletConnect,
  ledger,
  binance,
  coinbase,
  gnosisSafe,
  zenGo,
  monitorAddress,
} as const


export default wallets
