import React from 'react'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Input } from 'views/HomeView/common'

import messages from './messages'


const storeSelector = (store: Store) => ({
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
})

const BurnInput: React.FC = () => {
  const { field } = stakeCtx.useData()

  const { sdk } = useConfig()
  const { mintTokenBalance, mintedShares } = useStore(storeSelector)

  const maxBurn = mintedShares > mintTokenBalance
    ? mintTokenBalance
    : mintedShares

  return (
    <Input
      balance={maxBurn}
      token={sdk.config.tokens.mintToken}
      balanceTitle={{
        ...messages.balanceTitle,
        values: { mintToken: sdk.config.tokens.mintToken },
      }}
      onMaxButtonClick={() => field.setValue(maxBurn)}
    />
  )
}


export default React.memo(BurnInput)
