import React from 'react'
import { commonMessages } from 'helpers'

import { swapCtx } from 'views/SwapView/util'
import { SubmitButtonWrapper } from 'views/SwapView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { unboost } = swapCtx.useData()

  return (
    <SubmitButtonWrapper
      className={className}
      field={unboost.percentField}
      tooltip={unboost.unboostTooltip}
      title={commonMessages.buttonTitle.unboost}
      disabled={unboost.isUnboostDisabled}
      loading={unboost.isUnboostLoading}
      onClick={unboost.submit}
    />
  )
}


export default React.memo(SubmitButton)
