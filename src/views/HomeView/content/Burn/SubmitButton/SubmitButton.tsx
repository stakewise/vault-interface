import React, { useCallback } from 'react'
import { commonMessages } from 'helpers'

import { openTransactionsFlowModal } from 'layouts/modals'
import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { burn, field } = stakeCtx.useData()

  const handleClick = useCallback(() => {
    const shares = field.value

    if (shares) {
      burn.submit(shares)
    }
  }, [ burn, field ])

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.burn}
      loading={burn.isSubmitting}
      onClick={handleClick}
    />
  )
}


export default React.memo(SubmitButton)
