import React, { useCallback, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { methods } from 'helpers'
import { wallets } from 'config/core'
import device from 'modules/device'
import { useConfig } from 'config'
import cx from 'classnames'

import ConnectorButton from './ConnectorButton/ConnectorButton'


type ConnectorsViewProps = {
  className?: string
  onSelect: (walletId: WalletIds) => void
}

const walletsArr = Object.values(wallets)
const mobileWallets = walletsArr.filter(({ location }) => location.includes('mobile'))
const desktopWallets = walletsArr.filter(({ location }) => location.includes('desktop'))

const ConnectorsView: React.FC<ConnectorsViewProps> = (props) => {
  const { className, onSelect } = props

  const { chainId } = useConfig()
  const pathname = usePathname()
  const { isDesktop } = device.useData()

  const setDeepLink = useCallback((id: WalletIds) => {
    if (id === 'io.metamask' && !isDesktop) {
      const hostname = methods.getHostName()

      return `https://metamask.app.link/dapp/${hostname}${pathname}`
    }
  }, [ isDesktop, pathname ])

  const walletsList = useMemo(() => {
    const walletsItems = isDesktop ? desktopWallets : mobileWallets

    const list = walletsItems
      .filter((wallet) => wallet.networks.includes(chainId))
      .map((wallet) => {
        const title: Intl.Message | string = wallet.title
        const logo = wallet.logo as string

        return {
          ...wallet,
          logo,
          title,
          deepLink: setDeepLink(wallet.id),
          isDisabled: wallet.isInjectedWallet
            ? wallet.isDisabled(isDesktop)
            : false,
        }
      })

    if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID) {
      return list.filter(({ id }) => id !== wallets.walletConnect.id)
    }

    return list
  }, [ isDesktop, chainId, setDeepLink ])

  const [ selectedId, setSelectedId ] = useState<WalletIds | null>(null)

  const handleConnect = useCallback((id: WalletIds) => {
    setSelectedId(id)

    try {
      onSelect(id)
    }
    catch {
      setSelectedId(null)
    }
  }, [ onSelect ])

  return (
    <div
      className={cx(className, 'flex flex-wrap items-center justify-center gap-x-16 gap-y-24 rounded-8 overflow-hidden')}
    >
      {
        walletsList.map(({ id, title, logo, isDisabled, deepLink }) => {
          const button = (
            <ConnectorButton
              key={id}
              logo={logo}
              title={title}
              deepLink={deepLink}
              isDisabled={isDisabled}
              isLoading={id === selectedId}
              dataTestId={`${id}-connector-button`}
              onClick={() => handleConnect(id)}
            />
          )

          if (!isDisabled) {
            return button
          }
        })
      }
    </div>
  )
}


export default React.memo(ConnectorsView)
