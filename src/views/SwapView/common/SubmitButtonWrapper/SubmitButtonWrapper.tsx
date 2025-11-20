import React from 'react'
import { useConfig } from 'config'

import ConnectButton from './ConnectButton/ConnectButton'
import SubmitButton, { SubmitButtonProps } from './SubmitButton/SubmitButton'


type SubmitButtonWrapperProps = SubmitButtonProps & {
  className?: string
}

const SubmitButtonWrapper: React.FC<SubmitButtonWrapperProps> = (props) => {
  const { className } = props

  const { address } = useConfig()

  if (!address) {
    return (
      <ConnectButton className={className} />
    )
  }

  return (
    <SubmitButton {...props} />
  )
}


export default React.memo(SubmitButtonWrapper)
