import React, { useCallback } from 'react'
import { useConfig } from 'config'

import { swapCtx } from 'views/SwapView/util'
import { TokenDropdown, TokenAmountInputView } from 'components'


const StakeInput: React.FC = () => {
  const { address } = useConfig()
  const { stake } = swapCtx.useData()

  const onMaxButtonClick = useCallback(() => {
    stake.field.setValue(stake.maxStakeAmount)
  }, [ stake ])

  return (
    <TokenAmountInputView
      field={stake.field}
      loading={stake.isStakeLoading}
      balance={{
        value: address ? stake.swapTokens.selected.balance : stake.swapTokens.selected.emptyBalance,
        token: stake.swapTokens.selected.name as Tokens,
        units: stake.swapTokens.selected.units,
      }}
      tokenNode={(
        <TokenDropdown
          value={stake.swapTokens.selected.name as Tokens}
          tokens={stake.swapTokens.list}
          dataTestId="token-select"
          isDisabled={stake.isStakeLoading}
          onChange={(token) => {
            if (token !== stake.swapTokens.selected.address) {
              stake.field.reset()
              stake.swapTokens.setSelected(token)
            }
          }}
        />
      )}
      dataTestId="amount-input"
      onMaxButtonClick={address ? onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(StakeInput)
