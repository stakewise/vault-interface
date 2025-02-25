import { useMemo } from 'react'
import device from 'sw-modules/device'
import { constants } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'
import methods from 'sw-methods'

import type { LogoProps } from 'components'


const storeSelector = (store: Store) => ({
  isMMI: store.account.wallet.isMMI,
})

const useAccount = () => {
  const { isMobile } = device.useData()
  const { isMMI } = useStore(storeSelector)
  const { address, accountName, activeWallet } = useConfig()

  const addressOption = accountName || methods.shortenAddress(address)
  const logoFromWalletList = constants.walletList.find(({ id }) => id === activeWallet)?.logo

  let logo: LogoProps['name'] = logoFromWalletList || 'connector/monitorAddress'

  if (isMMI && activeWallet === constants.walletNames.metaMask) {
    logo = 'connector/MMI'
  }

  return useMemo(() => ({
    logo,
    title: isMobile ? '' : addressOption,
  }), [ addressOption, isMobile, logo ])
}


export default useAccount
