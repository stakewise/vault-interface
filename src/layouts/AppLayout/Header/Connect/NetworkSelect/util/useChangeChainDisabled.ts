import { useConfig } from 'config'
import { constants } from 'helpers'


const useChangeChainDisabled = () => {
  const { activeWallet } = useConfig()

  const isSupportedDAppBrowser = (
    activeWallet === constants.walletNames.dAppBrowser
    && typeof window !== 'undefined'
    && Boolean(window.ethereum?.isMetaMask)
  )

  const disabledChainSwitchWallets: WalletIds[] = [
    constants.walletNames.dAppBrowser,
    constants.walletNames.gnosisSafe,
    constants.walletNames.zenGo,
  ]

  return (
    !isSupportedDAppBrowser
    && disabledChainSwitchWallets.includes(activeWallet as WalletIds)
  )
}


export default useChangeChainDisabled
