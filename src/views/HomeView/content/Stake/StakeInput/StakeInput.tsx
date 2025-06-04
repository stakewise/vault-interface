import React from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { TokenDropdown, TokenAmountInputView } from 'components'


const storeSelector = (store: Store) => ({
  isSwapTokenRatesFetching: store.swapTokenRates.isFetching,
  isSwapTokenBalancesFetching: store.account.swapTokenBalances.isFetching,
})

const StakeInput: React.FC = () => {
  const { stake, field } = stakeCtx.useData()
  const { address, isReadOnlyMode } = useConfig()
  const { isSwapTokenRatesFetching, isSwapTokenBalancesFetching } = useStore(storeSelector)

  return (
    <TokenAmountInputView
      field={field}
      loading={stake.isSubmitting || isReadOnlyMode}
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
          isFetching={isSwapTokenRatesFetching || isSwapTokenBalancesFetching}
          onChange={(token) => {
            if (token !== stake.swapTokens.selected.address) {
              field.reset()
              stake.swapTokens.setSelected(token)
            }
          }}
        />
      )}
      dataTestId="amount-input"
      onMaxButtonClick={address ? stake.onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(StakeInput)
