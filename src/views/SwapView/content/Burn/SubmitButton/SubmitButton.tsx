import React from 'react'
import { commonMessages } from 'helpers'

import { swapCtx } from 'views/SwapView/util'
import { SubmitButtonWrapper } from 'views/SwapView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { burn } = swapCtx.useData()

  return (
    <SubmitButtonWrapper
      className={className}
      title={commonMessages.buttonTitle.burn}
      disabled={burn.isBurnDisabled}
      loading={burn.isBurnLoading}
      field={burn.field}
      onClick={burn.submit}
    />
  )
}


export default React.memo(SubmitButton)
