import React, { useCallback, useEffect, useState } from 'react'
import { useConfig, wallets } from 'config'
import { usePathname } from 'next/navigation'
import device from 'modules/device'
import modal from 'modules/modal'
import cx from 'classnames'

import { Modal, Text, Href } from 'components'

import modalId from './modalId'
import ConnectorsView from './ConnectorsView/ConnectorsView'
import useMetaMaskOnboarding from './util/useMetaMaskOnboarding'
import MonitorAddressView from './MonitorAddressView/MonitorAddressView'

import messages from './messages'


export const [ ConnectWalletModal, openConnectWalletModal ] = (
  modal.wrapper(modalId, (props) => {
    const { closeModal } = props

    const pathname = usePathname()
    const { isMobile } = device.useData()
    const { address, wallet } = useConfig()
    const metaMaskOnboarding = useMetaMaskOnboarding()
    const [ selectedWalletId, setSelectedWalletId ] = useState<WalletIds | null>(null)

    useEffect(() => {
      return () => {
        closeModal()
      }
    }, [ pathname, closeModal ])

    useEffect(() => {
      if (address) {
        closeModal()
      }
    }, [ address, closeModal ])

    const handleSelectConnector = useCallback((walletId: WalletIds) => {
      setSelectedWalletId(walletId)

      if (walletId !== wallets.monitorAddress.id) {
        return wallet.connect(walletId)
      }
    }, [ wallet ])

    const isMonitorAddress = selectedWalletId === wallets.monitorAddress.id

    const bottomNode = !isMonitorAddress && (
      <div className="mt-32 text-center">
        <Href
          className="inline-block cursor-pointer hover-underline text-primary"
          tabIndex="0"
          onClick={() => metaMaskOnboarding.current?.startOnboarding()}
        >
          <Text
            className="inline-block"
            dataTestId="select-wallet-modal-no-wallet-button"
            message={messages.noWallet}
            size="t14m"
            color="inherit"
          />
        </Href>
      </div>
    )

    const title = isMonitorAddress ? messages.checkWallet : messages.title

    return (
      <Modal
        title={title}
        size="narrow"
        bottomNode={bottomNode}
        contentClassName={cx({
          'flex justify-center': isMobile,
        })}
        closeModal={closeModal}
        onBackButtonClick={isMonitorAddress ? () => setSelectedWalletId(null) : undefined}
      >
        {
          isMonitorAddress ? (
            <MonitorAddressView />
          ) : (
            <ConnectorsView onSelect={handleSelectConnector} />
          )
        }
      </Modal>
    )
  })
)
