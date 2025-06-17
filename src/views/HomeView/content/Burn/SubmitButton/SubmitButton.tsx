import React from 'react'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { burn } = stakeCtx.useData()

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.burn}
      loading={burn.isSubmitting}
      onClick={burn.submit}
    />
  )
}


export default React.memo(SubmitButton)
