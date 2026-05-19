import { useMemo } from 'react'
import { methods } from 'helpers'
import device from 'modules/device'
import { useConfig, wallets } from 'config'


const useAccount = () => {
  const { isDesktop } = device.useData()
  const { address, accountName, activeWallet } = useConfig()

  const addressOption = accountName || methods.shortenAddress(address)

  const wallet = activeWallet ? wallets[activeWallet] : null
  const logo = wallet?.logo || 'connector/monitorAddress'

  return useMemo(() => ({
    logo,
    title: !isDesktop ? '' : addressOption,
  }), [ addressOption, isDesktop, logo ])
}


export default useAccount
