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
        value: stake.swapTokens.sellToken.balance,
        token: stake.swapTokens.sellToken.name as Tokens,
        units: stake.swapTokens.sellToken.units,
      }}
      tokenNode={(
        <TokenDropdown
          value={stake.swapTokens.sellToken.name as Tokens}
          tokens={stake.swapTokens.list}
          dataTestId="token-select"
          isDisabled={stake.isStakeLoading}
          onChange={(sellToken) => {
            if (sellToken !== stake.swapTokens.sellToken.address) {
              stake.field.reset()
              stake.swapTokens.set({ sellToken })
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
