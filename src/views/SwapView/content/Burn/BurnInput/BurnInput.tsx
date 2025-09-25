import React, { useCallback } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { constants } from 'helpers'

import { swapCtx } from 'views/SwapView/util'
import { TokenAmountInput } from 'components'

import messages from './messages'


const storeSelector = (store: Store) => ({
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
})

const BurnInput: React.FC = () => {
  const { sdk, address } = useConfig()
  const { burn } = swapCtx.useData()
  const { mintedShares } = useStore(storeSelector)

  const onMaxButtonClick = useCallback(() => {
    burn.field.setValue(mintedShares)
  }, [ burn, mintedShares ])

  return (
    <TokenAmountInput
      field={burn.field}
      loading={burn.isBurnLoading}
      balance={{
        token: sdk.config.tokens.mintToken,
        value: address ? mintedShares : constants.blockchain.emptyBalance,
        title: {
          ...messages.balanceTitle,
          values: { mintToken: sdk.config.tokens.mintToken },
        },
      }}
      dataTestId="mint-amount-input"
      onMaxButtonClick={address ? onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(BurnInput)
