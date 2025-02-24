import React, { useCallback } from 'react'
import { useConfig } from 'config'

import { Input } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'


const BoostInput: React.FC = () => {
  const { sdk } = useConfig()
  const { data, field } = stakeCtx.useData()

  const handleMaxClick = useCallback(() => {
    field.setValue(data.mintTokenBalance)
  }, [ field, data ])

  return (
    <Input
      balance={data.mintTokenBalance}
      token={sdk.config.tokens.mintToken}
      onMaxButtonClick={handleMaxClick}
    />
  )
}


export default React.memo(BoostInput)
