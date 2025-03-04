import React, { useCallback } from 'react'
import cx from 'classnames'
import { useConfig } from 'config'

import { Button } from 'components'

import messages from './messages'


type DisconnectButtonProps = {
  className?: string
}

const DisconnectButton: React.FC<DisconnectButtonProps> = (props) => {
  const { className } = props
  const { wallet } = useConfig()

  const handleDisconnect = useCallback(() => {
    wallet.disconnect()
  }, [ wallet ])

  return (
    <div className={cx(className, 'border-top border-stone/30 pt-8')}>
      <Button
        fullWidth
        color="light"
        title={messages.buttonTitle}
        dataTestId="disconnect-wallet-button"
        onClick={handleDisconnect}
      />
    </div>
  )
}


export default React.memo(DisconnectButton)
