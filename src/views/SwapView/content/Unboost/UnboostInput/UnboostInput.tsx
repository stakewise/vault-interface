import React from 'react'

import { PercentInput } from 'components'

import { swapCtx } from 'views/SwapView/util'


const UnboostInput: React.FC = () => {
  const { unboost } = swapCtx.useData()

  const isDisabled = unboost.isUnboostDisabled || unboost.isUnboostLoading

  return (
    <PercentInput
      field={unboost.percentField}
      isDisabled={isDisabled}
      dataTestId="amount"
    />
  )
}


export default React.memo(UnboostInput)
