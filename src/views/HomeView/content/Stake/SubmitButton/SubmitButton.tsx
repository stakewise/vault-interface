import React from 'react'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ className }) => {
  const { stake } = stakeCtx.useData()

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.stake}
      loading={stake.isSubmitting || stake.isAllowanceFetching || stake.isSwapQuoteFetching}
      onClick={stake.submit}
    />
  )
}


export default React.memo(SubmitButton)
