import * as constants from 'sw-helpers/constants'


const getInjectedProvider = (walletName: WalletIds) => {
  if (walletName === constants.walletNames.okx) {
    return window.okxwallet
  }

  if (walletName === constants.walletNames.rabby) {
    return window.rabby
  }

  if (walletName === constants.walletNames.taho) {
    return window.taho
  }

  if (walletName === constants.walletNames.trustWallet) {
    return window.trustwallet
  }

  if (walletName === constants.walletNames.braveWallet) {
    return window.braveEthereum
  }

  if (walletName === constants.walletNames.metaMask) {
    return window.ethereum
  }

  return null
}


export default getInjectedProvider
