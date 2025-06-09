import React from 'react'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { mint } = stakeCtx.useData()

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.mint}
      loading={mint.isSubmitting}
      onClick={mint.submit}
    />
  )
}


export default React.memo(SubmitButton)
