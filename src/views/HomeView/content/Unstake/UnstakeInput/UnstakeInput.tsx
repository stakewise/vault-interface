import React from 'react'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { Input } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'


const storeSelector = (store: Store) => ({
  maxWithdrawAssets: store.vault.user.balances.withdraw.maxAssets,
})

const UnstakeInput: React.FC = () => {
  const { sdk } = useConfig()
  const { field, unstake } = stakeCtx.useData()

  const { maxWithdrawAssets } = useStore(storeSelector)

  return (
    <Input
      balance={maxWithdrawAssets}
      token={sdk.config.tokens.depositToken}
      isLoading={unstake.isSubmitting}
      onMaxButtonClick={() => field.setValue(maxWithdrawAssets)}
    />
  )
}


export default React.memo(UnstakeInput)
