import React from 'react'
import { commonMessages } from 'helpers'

import { swapCtx } from 'views/SwapView/util'
import { SubmitButtonWrapper } from 'views/SwapView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { mint } = swapCtx.useData()

  return (
    <SubmitButtonWrapper
      className={className}
      title={commonMessages.buttonTitle.mint}
      disabled={mint.isMintDisabled}
      loading={mint.isMintLoading}
      field={mint.field}
      onClick={mint.submit}
    />
  )
}


export default React.memo(SubmitButton)
