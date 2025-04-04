import * as constants from 'helpers/constants'


const injectedWalletNames = [
  constants.walletNames.okx,
  constants.walletNames.taho,
  constants.walletNames.rabby,
  constants.walletNames.metaMask,
  constants.walletNames.braveWallet,
  constants.walletNames.trustWallet,
] as const

const isInjectedWallet = (walletName: WalletIds) => injectedWalletNames.includes(walletName as any)


export default isInjectedWallet
