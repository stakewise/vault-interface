import React from 'react'
import { formatEther } from 'ethers'
import { useFiatValues } from 'sw-hooks'

import Text from '../Text/Text'
import type { TextProps } from '../Text/Text'


export type FiatAmountProps = Omit<TextProps, 'message'> & {
  amount: bigint | string
  token: Tokens
}

const FiatAmount: React.FC<FiatAmountProps> = (props) => {
  const { amount, token, ...textProps } = props

  const value = typeof amount === "bigint"
    ? formatEther(amount)
    : amount

  const { fiatAmount: { formattedValue } } = useFiatValues({
    fiatAmount: {
      value,
      token,
      isMinimal: true,
    },
  })

  return (
    <Text message={formattedValue} {...textProps} />
  )
}


export default React.memo(FiatAmount)
