import { useConfig, wallets } from 'config'


const useChangeChainDisabled = () => {
  const { activeWallet } = useConfig()

  const isSupportedDAppBrowser = (
    activeWallet === wallets.dAppBrowser.id
    && typeof window !== 'undefined'
    && Boolean(window.ethereum?.isMetaMask)
  )

  const disabledChainSwitchWallets: WalletIds[] = [
    wallets.dAppBrowser.id,
    wallets.gnosisSafe.id,
    wallets.zenGo.id,
  ]

  return (
    !isSupportedDAppBrowser
    && disabledChainSwitchWallets.includes(activeWallet as WalletIds)
  )
}


export default useChangeChainDisabled
