import React, { useCallback } from 'react'
import { useConfig } from 'config'

import { Input } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { useStore } from 'hooks'


const storeSelector = (store: Store) => ({
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
})

const BoostInput: React.FC = () => {
  const { sdk } = useConfig()
  const { field, boost } = stakeCtx.useData()
  const { mintTokenBalance } = useStore(storeSelector)

  const handleMaxClick = useCallback(() => {
    field.setValue(mintTokenBalance)
  }, [ field, mintTokenBalance ])

  return (
    <Input
      balance={mintTokenBalance}
      isLoading={boost.isSubmitting}
      token={sdk.config.tokens.mintToken}
      onMaxButtonClick={handleMaxClick}
    />
  )
}


export default React.memo(BoostInput)
