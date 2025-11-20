import React from 'react'
import { commonMessages } from 'helpers'

import { SubmitButtonWrapper } from 'views/SwapView/common'
import { swapCtx } from 'views/SwapView/util'


type UnstakeButtonProps = {
  className?: string
  isDisabled?: boolean
}

const SubmitButton: React.FC<UnstakeButtonProps> = (props) => {
  const { className } = props

  const { unstake } = swapCtx.useData()

  return (
    <SubmitButtonWrapper
      className={className}
      field={unstake.field}
      title={commonMessages.buttonTitle.unstake}
      disabled={unstake.isUnstakeDisabled}
      loading={unstake.isUnstakeLoading}
      onClick={unstake.submit}
    />
  )
}


export default React.memo(SubmitButton)
