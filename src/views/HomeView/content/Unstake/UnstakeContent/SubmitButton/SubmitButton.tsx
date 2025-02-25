import React, { useCallback } from 'react'
import { commonMessages } from 'helpers'

import { Button } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'


type UnstakeButtonProps = {
  className?: string
}

const SubmitButton: React.FC<UnstakeButtonProps> = (props) => {
  const { className } = props

  const { unstake } = stakeCtx.useData()

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.unstake}
      loading={unstake.isFetching || unstake.isSubmitting}
      onClick={unstake.submit}
    />
  )
}


export default React.memo(SubmitButton)
