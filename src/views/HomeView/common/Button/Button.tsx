import React from 'react'
import { useConfig } from 'config'

import ConnectButton from './ConnectButton/ConnectButton'
import SubmitButton, { SubmitButtonProps } from './SubmitButton/SubmitButton'


type ButtonProps = SubmitButtonProps

const Button: React.FC<ButtonProps> = (props) => {
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


export default React.memo(Button)
