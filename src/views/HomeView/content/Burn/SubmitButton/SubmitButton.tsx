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

  const { stake } = stakeCtx.useData()

  const handleClick = useCallback(() => {
    if (stake.isApproveRequired) {
      openTransactionsFlowModal({
        flow: 'stake',
        onStart: ({ setTransaction }) => stake.submit({ setTransaction }),
      })
    }
    else {
      stake.submit()
    }
  }, [ stake ])

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.stake}
      loading={stake.isSubmitting}
      onClick={handleClick}
    />
  )
}


export default React.memo(SubmitButton)
