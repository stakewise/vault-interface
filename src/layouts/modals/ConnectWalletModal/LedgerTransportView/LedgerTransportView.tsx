import React, { useCallback } from 'react'
import { useConfig, wallets } from 'config'
import cx from 'classnames'

import { Button } from 'components'

import messages from './messages'


type LedgerTransportViewProps = {
  className?: string
}

const LedgerTransportView: React.FC<LedgerTransportViewProps> = (props) => {
  const { className } = props

  const { wallet } = useConfig()

  const selectUSB = useCallback(() => wallet.connect(wallets.ledger.id, 'usb'), [ wallet ])

  const selectBLE = useCallback(() => wallet.connect(wallets.ledger.id, 'ble'), [ wallet ])

  return (
    <div className={cx(className, 'mx-auto max-w-[300rem]')}>
      <Button
        title={messages.usbButton}
        onClick={selectUSB}
        fullWidth
      />
      <Button
        className="mt-24"
        title={messages.bleButton}
        onClick={selectBLE}
        fullWidth
      />
    </div>
  )
}


export default React.memo(LedgerTransportView)
