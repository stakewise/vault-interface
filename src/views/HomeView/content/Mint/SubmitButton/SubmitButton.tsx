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

  const { mint, field } = stakeCtx.useData()

  const handleClick = useCallback(() => {
    const shares = field.value

    if (shares) {
      mint.submit(shares)
    }
  }, [ mint, field ])

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.mint}
      loading={mint.isSubmitting}
      onClick={handleClick}
    />
  )
}


export default React.memo(SubmitButton)
