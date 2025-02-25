import React from 'react'
import { useConfig } from 'config'

import { stakeCtx, emptyBalance, Tab } from 'views/HomeView/StakeContext/util'
import { TokenAmountInput, TokenAmountInputProps } from 'components'


type InputProps = {
  className?: string
  balance: bigint
  token: Tokens
  isLoading?: boolean
  onMaxButtonClick?: () => void
}

const Input: React.FC<InputProps> = (props) => {
  const { className, balance, token, isLoading, onMaxButtonClick } = props

  const { address } = useConfig()
  const { field, tabs, data, stake, unstake, boost } = stakeCtx.useData()

  const isDisabled = Boolean(data.boost.exitingPercent) && [ Tab.Boost, Tab.Unboost ].includes(tabs.value)
  const isSubmitting = stake.isSubmitting || unstake.isSubmitting || boost.isSubmitting || isLoading || isDisabled

  let tokenBalance: TokenAmountInputProps['tokenBalance'] = 0n

  if (!address) {
    tokenBalance = tabs.value === Tab.Stake
      ? emptyBalance
      : undefined
  }
  else {
    tokenBalance = balance
  }

  return (
    <TokenAmountInput
      className={className}
      token={token}
      field={field}
      loading={isSubmitting}
      tokenBalance={tokenBalance}
      dataTestId="amount-input"
      onMaxButtonClick={address ? onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(Input)
