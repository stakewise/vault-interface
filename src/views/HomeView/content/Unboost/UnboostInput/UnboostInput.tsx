import React from 'react'

import { PercentInput } from 'components'

import { stakeCtx } from 'views/HomeView/StakeContext/util'


const UnboostInput: React.FC = () => {
  const { unboost, percentField } = stakeCtx.useData()

  const isDisabled = unboost.isDisabled || unboost.isSubmitting

  return (
    <PercentInput
      field={percentField}
      isDisabled={isDisabled}
      dataTestId="amount"
    />
  )
}


export default React.memo(UnboostInput)
