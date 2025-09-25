import React from 'react'
import { commonMessages } from 'helpers'

import { Button } from 'components'
import { openConnectWalletModal } from 'layouts/modals'


type ConnectButtonProps =  {
  className?: string
}

const ConnectButton: React.FC<ConnectButtonProps> = (props) => {
  const { className } = props

  return (
    <Button
      className={className}
      size="xl"
      fullWidth
      dataTestId="stake-connect-button"
      title={commonMessages.buttonTitle.connect}
      onClick={openConnectWalletModal}
    />
  )
}


export default React.memo(ConnectButton)
