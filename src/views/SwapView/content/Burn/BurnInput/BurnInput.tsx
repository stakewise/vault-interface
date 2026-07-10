import React, { useCallback } from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'

import { swapCtx } from 'views/SwapView/util'
import { TokenAmountInput } from 'components'

import messages from './messages'


const BurnInput: React.FC = () => {
  const { sdk, address } = useConfig()
  const { burn } = swapCtx.useData()

  const onMaxButtonClick = useCallback(() => {
    burn.field.setValue(burn.maxBurnShares)
  }, [ burn ])

  return (
    <TokenAmountInput
      field={burn.field}
      disabled={burn.isBurnLoading}
      balance={{
        token: sdk.config.tokens.mintToken,
        value: address ? burn.maxBurnShares : constants.blockchain.emptyBalance,
        title: {
          ...messages.balanceTitle,
          values: { mintToken: sdk.config.tokens.mintToken },
        },
      }}
      dataTestId="amount-input"
      onMaxButtonClick={address ? onMaxButtonClick : undefined}
    />
  )
}


export default React.memo(BurnInput)
