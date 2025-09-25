import React, { useCallback } from 'react'
import { constants } from 'helpers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { swapCtx } from 'views/SwapView/util'
import { TokenAmountInput } from 'components'


const storeSelector = (store: Store) => ({
  walletMintedShares: store.account.balances.mintToken,
})

const UnstakeInput: React.FC = () => {
  const { sdk, address } = useConfig()
  const { unstake } = swapCtx.useData()
  const { walletMintedShares } = useStore(storeSelector)

  const onMaxButtonClick = useCallback(() => {
    unstake.field.setValue(walletMintedShares)
  }, [ unstake, walletMintedShares ])

  return (
    <TokenAmountInput
      field={unstake.field}
      loading={unstake.isUnstakeLoading}
      balance={{
        token: sdk.config.tokens.mintToken,
        value: address ? walletMintedShares : constants.blockchain.emptyBalance,
      }}
      dataTestId="amount-input"
      onMaxButtonClick={address ? onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(UnstakeInput)
