import React, { useCallback, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import device from 'modules/device'
import { constants } from 'helpers'
import methods from 'helpers/methods'
import { useStore } from 'hooks'
import cx from 'classnames'

import { LogoProps } from 'components'

import ConnectorButton from './ConnectorButton/ConnectorButton'


type ConnectorsViewProps = {
  className?: string
  onSelect: (walletId: WalletIds) => void
}

const storeSelector = (store: Store) => ({
  isMMI: store.account.wallet.isMMI,
})

const desktopWallets = constants.walletList.filter(({ id }) => (
  id !== constants.walletNames.dAppBrowser
  && id !== constants.walletNames.gnosisSafe
))

const mobileWallets = constants.walletList.filter(({ id }) => {
  const list = [
    constants.walletNames.metaMask,
    constants.walletNames.coinbase,
    constants.walletNames.walletConnect,
    constants.walletNames.monitorAddress,
  ] as string[]

  return list.includes(id)
})

const setIsDisabled = (id: WalletIds): boolean => {
  const provider = methods.getInjectedProvider(id)

  return provider === null ? false : !provider
}

const ConnectorsView: React.FC<ConnectorsViewProps> = (props) => {
  const { className, onSelect } = props

  const pathname = usePathname()
  const { isDesktop } = device.useData()
  const { isMMI } = useStore(storeSelector)

  const setDeepLink = useCallback((id: WalletIds) => {
    if (id === constants.walletNames.metaMask && !isDesktop) {
      const hostname = methods.getHostName()

      return `https://metamask.app.link/dapp/${hostname}${pathname}`
    }
  }, [ isDesktop, pathname ])

  const walletsList = useMemo(() => {
    const wallets = isDesktop ? desktopWallets : mobileWallets

    const list = wallets
      .map((wallet) => {
        let title: Intl.Message | string = wallet.title
        let logo: LogoProps['name'] = wallet.logo

        if (wallet.id === constants.walletNames.metaMask && isMMI) {
          logo = 'connector/MMI'
          title = 'MMI'
        }

        return {
          ...wallet,
          logo,
          title,
          deepLink: setDeepLink(wallet.id),
          isDisabled: setIsDisabled(wallet.id),
        }
      })

    if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID) {
      return list.filter(({ id }) => id !== constants.walletNames.walletConnect)
    }

    return list
  }, [ isDesktop, isMMI, setDeepLink ])

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
