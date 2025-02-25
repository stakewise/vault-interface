import React, { useCallback } from 'react'
import { useConfig } from 'config'

import { Input } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'


const UnstakeInput: React.FC = () => {
  const { sdk } = useConfig()
  const { unstake, field, data } = stakeCtx.useData()

  const handleMaxClick = useCallback(() => {
    const maxUnstake = unstake.getMaxStake()

    field.setValue(maxUnstake)
  }, [ field, unstake ])

  return (
    <Input
      balance={data.mintTokenBalance}
      token={sdk.config.tokens.mintToken}
      isLoading={unstake.isSubmitting}
      onMaxButtonClick={handleMaxClick}
    />
  )
}


export default React.memo(UnstakeInput)
