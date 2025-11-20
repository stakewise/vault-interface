import React, { useCallback } from 'react'
import { useConfig } from 'config'

import { swapCtx } from 'views/SwapView/util'
import { TokenAmountInput } from 'components'


const UnstakeInput: React.FC = () => {
  const { sdk, address } = useConfig()
  const { unstake } = swapCtx.useData()

  const onMaxButtonClick = useCallback(() => {
    unstake.field.setValue(unstake.maxUnstakeAmount)
  }, [ unstake ])

  return (
    <TokenAmountInput
      field={unstake.field}
      loading={unstake.isUnstakeLoading}
      balance={{
        token: sdk.config.tokens.depositToken,
        value: unstake.maxUnstakeAmount,
      }}
      dataTestId="amount-input"
      onMaxButtonClick={address ? onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(UnstakeInput)
