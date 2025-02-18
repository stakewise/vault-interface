import { walletNames } from 'sw-helpers/constants'

import okxConfig from './okx/config'
import tahoConfig from './taho/config'
import rabbyConfig from './rabby/config'
import metaMaskConfig from './metaMask/config'
import dAppBrowserConfig from './dAppBrowser/config'
import trustWalletConfig  from './trustWallet/config'
import braveWalletConfig  from './braveWallet/config'


export default {
  [walletNames.okx]: okxConfig,
  [walletNames.taho]: tahoConfig,
  [walletNames.rabby]: rabbyConfig,
  [walletNames.metaMask]: metaMaskConfig,
  [walletNames.dAppBrowser]: dAppBrowserConfig,
  [walletNames.trustWallet]: trustWalletConfig,
  [walletNames.braveWallet]: braveWalletConfig,
} as const
