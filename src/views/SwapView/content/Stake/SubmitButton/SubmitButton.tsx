import React from 'react'
import { commonMessages } from 'helpers'

import { swapCtx } from 'views/SwapView/util'
import { SubmitButtonWrapper } from 'views/SwapView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ className }) => {
  const { stake } = swapCtx.useData()

  return (
    <SubmitButtonWrapper
      className={className}
      title={commonMessages.buttonTitle.stake}
      disabled={stake.isStakeDisabled}
      loading={stake.isStakeLoading}
      field={stake.field}
      onClick={stake.submit}
    />
  )
}


export default React.memo(SubmitButton)
