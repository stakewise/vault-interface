import React, { useCallback } from 'react'
import { useConfig } from 'config'

import { TokenAmountInput } from 'components'


type Input = {
  className?: string
  balance: bigint
  field: Forms.Field<bigint>
  isLoading: boolean
}

const BoostInput: React.FC<Input> = (props) => {
  const { className, field, balance, isLoading } = props

  const { sdk, address } = useConfig()

  const handleMaxClick = useCallback(() => {
    field.setValue(balance)
  }, [ field, balance ])

  return (
    <TokenAmountInput
      className={className}
      field={field}
      disabled={isLoading}
      balance={{
        token: sdk.config.tokens.mintToken,
        value: address ? balance : undefined,
      }}
      dataTestId="amount-input"
      onMaxButtonClick={address ? handleMaxClick : undefined}
    />
  )
}


export default React.memo(BoostInput)
