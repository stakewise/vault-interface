import React from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'

import { stakeCtx, emptyBalance, Tab } from 'views/HomeView/StakeContext/util'
import { TokenAmountInput, TokenAmountInputProps } from 'components'


const storeSelector = (store: Store) => ({
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

type InputProps = {
  className?: string
  balance: bigint
  token: Tokens
  isLoading?: boolean
  balanceTitle?: TokenAmountInputProps['balanceTitle']
  onMaxButtonClick?: () => void
}

const Input: React.FC<InputProps> = (props) => {
  const { className, balance, token, balanceTitle, isLoading, onMaxButtonClick } = props

  const { address } = useConfig()
  const { exitingPercent } = useStore(storeSelector)
  const { field, tabs, stake, withdraw, boost } = stakeCtx.useData()

  const isDisabled = Boolean(exitingPercent) && [ Tab.Boost, Tab.Unboost ].includes(tabs.value)
  const isSubmitting = (
    isLoading
    || isDisabled
    || stake.isSubmitting
    // || boost.isSubmitting
    // || withdraw.isSubmitting
  )

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
      balanceTitle={balanceTitle}
      tokenBalance={tokenBalance}
      dataTestId="amount-input"
      onMaxButtonClick={address ? onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(Input)
