import React, { useCallback } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { constants } from 'helpers'

import { swapCtx } from 'views/SwapView/util'
import { TokenAmountInput } from 'components'

import messages from './messages'


const storeSelector = (store: Store) => ({
  maxMintShares: store.vault.user.balances.mintToken.maxMintShares,
})

const MintInput: React.FC = () => {
  const { sdk, address } = useConfig()
  const { mint } = swapCtx.useData()
  const { maxMintShares } = useStore(storeSelector)

  const onMaxButtonClick = useCallback(() => {
    mint.field.setValue(maxMintShares)
  }, [ mint, maxMintShares ])


  return (
    <TokenAmountInput
      field={mint.field}
      loading={mint.isMintLoading}
      balance={{
        token: sdk.config.tokens.mintToken,
        value: address ? maxMintShares : constants.blockchain.emptyBalance,
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


export default React.memo(MintInput)
