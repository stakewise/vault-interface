import React, { useCallback, useState } from 'react'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Input } from 'views/HomeView/common'


const storeSelector = (store: Store) => ({
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

const StakeInput: React.FC = () => {
  const { stake, field } = stakeCtx.useData()

  const { sdk } = useConfig()
  const { depositTokenBalance } = useStore(storeSelector)

  const [ isFetching, setFetching ] = useState(false)

  const handleMaxClick = useCallback(async () => {
    setFetching(true)

    const maxStake = await stake.getMaxStake(depositTokenBalance)
    field.setValue(maxStake)

    setFetching(false)
  }, [ field, stake, depositTokenBalance ])

  return (
    <Input
      isLoading={isFetching}
      balance={depositTokenBalance}
      token={sdk.config.tokens.depositToken}
      onMaxButtonClick={handleMaxClick}
    />
  )
}


export default React.memo(StakeInput)
