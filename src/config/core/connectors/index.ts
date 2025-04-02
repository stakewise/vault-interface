import { walletNames } from 'sw-helpers/constants'

import ledgerConfig from './ledger/config'
import injectedConfig from './injected/config'
import coinbaseConfig from './coinbase/config'
import gnosisSafeConfig from './gnosisSafe/config'
import walletConnectConfig from './walletConnect/config'
import monitorAddressConfig from './monitorAddress/config'


export default {
  [walletNames.ledger]: ledgerConfig,
  [walletNames.coinbase]: coinbaseConfig,
  [walletNames.gnosisSafe]: gnosisSafeConfig,
  [walletNames.monitorAddress]: monitorAddressConfig,

  // Wallet Connect
  [walletNames.zenGo]: walletConnectConfig.zenGo,
  [walletNames.walletConnect]: walletConnectConfig.walletConnect,

  // Injected
  [walletNames.okx]: injectedConfig.okx,
  [walletNames.taho]: injectedConfig.taho,
  [walletNames.rabby]: injectedConfig.rabby,
  [walletNames.metaMask]: injectedConfig.metaMask,
  [walletNames.braveWallet]: injectedConfig.braveWallet,
  [walletNames.trustWallet]: injectedConfig.trustWallet,
  [walletNames.dAppBrowser]: injectedConfig.dAppBrowser,
} as const
