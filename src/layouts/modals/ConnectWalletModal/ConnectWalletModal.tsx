import React, { useCallback, useEffect, useState, useMemo } from 'react'
import cx from 'classnames'
import modal from 'modules/modal'
import device from 'modules/device'
import { useConfig, wallets } from 'config'
import { usePathname } from 'next/navigation'

import { Modal, Text, Href } from 'components'

import modalId from './modalId'
import ConnectorsView from './ConnectorsView/ConnectorsView'
import useMetaMaskOnboarding from './util/useMetaMaskOnboarding'
import MonitorAddressView from './MonitorAddressView/MonitorAddressView'
import LedgerTransportView from './LedgerTransportView/LedgerTransportView'

import messages from './messages'


export const [ ConnectWalletModal, openConnectWalletModal, closeConnectWalletModal ] = (
  modal.wrapper(modalId, (props) => {
    const { closeModal } = props

    const pathname = usePathname()
    const { isDesktop } = device.useData()
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

      if (walletId !== wallets.monitorAddress.id && walletId !== wallets.ledger.id) {
        return wallet.connect(walletId)
      }
    }, [ wallet ])

    const isLedger = selectedWalletId === wallets.ledger.id
    const isMonitorAddress = selectedWalletId === wallets.monitorAddress.id

    const bottomNode = !isMonitorAddress && !isLedger && (
      <div className="mt-32 text-center">
        <Href
          className="inline-block cursor-pointer hover-underline text-primary"
          tabIndex="0"
          onClick={() => metaMaskOnboarding.current?.startOnboarding()}
        >
          <Text
            className="inline-block font-medium"
            dataTestId="select-wallet-modal-no-wallet-button"
            message={messages.noWallet}
            color="inherit"
            size="sm"
          />
        </Href>
      </div>
    )

    let title = messages.title

    if (isMonitorAddress) {
      title = messages.checkWallet
    }

    if (isLedger) {
      title = messages.ledger
    }

    const view = useMemo(() => {
      if (isMonitorAddress) {
        return (
          <MonitorAddressView />
        )
      }

      if (isLedger) {
        return (
          <LedgerTransportView />
        )
      }

      return (
        <ConnectorsView onSelect={handleSelectConnector} />
      )
    }, [ isMonitorAddress, isLedger, handleSelectConnector ])

    return (
      <Modal
        title={title}
        size="narrow"
        bottomNode={bottomNode}
        contentClassName={cx({
          'flex justify-center': !isDesktop,
        })}
        closeModal={closeModal}
        onBackButtonClick={(isMonitorAddress || isLedger) ? () => setSelectedWalletId(null) : undefined}
      >
        {view}
      </Modal>
    )
  })
)
