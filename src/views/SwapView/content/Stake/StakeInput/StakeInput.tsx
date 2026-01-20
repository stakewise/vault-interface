import React, { useCallback, useMemo } from 'react'
import { useConfig } from 'config'

import { swapCtx } from 'views/SwapView/util'
import { TokenDropdown, TokenAmountInputView } from 'components'


const StakeInput: React.FC = () => {
  const { stake } = swapCtx.useData()
  const { sdk, address } = useConfig()

  const onMaxButtonClick = useCallback(() => {
    stake.field.setValue(stake.maxStakeAmount)
  }, [ stake ])

  const filteredList = useMemo(() => (
    stake.swapTokens.list.filter(({ address }) => address !== sdk.config.addresses.tokens.mintToken)
  ), [ sdk, stake.swapTokens.list ])

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
          tokens={filteredList}
          dataTestId="amount-input"
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
