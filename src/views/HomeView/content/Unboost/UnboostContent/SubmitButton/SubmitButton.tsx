import React from 'react'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { data, unboost } = stakeCtx.useData()

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.unboost}
      color="fancy-sunset"
      loading={data.isFetching}
      disabled={unboost.isSubmitting || unboost.isDisabled}
      onClick={unboost.submit}
    />
  )
}


export default React.memo(SubmitButton)
