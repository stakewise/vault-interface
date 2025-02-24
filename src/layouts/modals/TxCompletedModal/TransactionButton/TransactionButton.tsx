import React from 'react'
import { useConfig } from 'config'

import { Button } from 'components'

import messages from './messages'


type TransactionButtonProps = {
  className?: string
  hash: string
}

const TransactionButton: React.FC<TransactionButtonProps> = (props) => {
  const { className, hash } = props

  const { sdk } = useConfig()

  const link = `${sdk.config.network.blockExplorerUrl}/tx/${hash}`

  return (
    <Button
      className={className}
      icon="icon/link"
      href={link}
      title={messages.title}
      target="_blank"
      fullWidth
      color="crystal"
      dataTestId="etherscan-link"
    />
  )
}


export default React.memo(TransactionButton)
