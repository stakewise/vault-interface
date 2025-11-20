import { useMemo } from 'react'
import { methods } from 'helpers'
import device from 'modules/device'
import { useConfig, wallets } from 'config'

import type { LogoProps } from 'components'


const useAccount = () => {
  const { isMobile } = device.useData()
  const { address, accountName, activeWallet } = useConfig()

  const addressOption = accountName || methods.shortenAddress(address)

  const logo: LogoProps['name'] =  activeWallet
    ? wallets[activeWallet].logo
    : 'connector/monitorAddress'

  return useMemo(() => ({
    logo,
    title: isMobile ? '' : addressOption,
  }), [ addressOption, isMobile, logo ])
}


export default useAccount
