import React, { useCallback } from 'react'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import { openTransactionsFlowModal } from 'layouts/modals'
import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { isGnosis } = useConfig()
  const { stake, field } = stakeCtx.useData()

  const handleClick = useCallback(() => {
    const assets = field.value

    if (assets) {
      if (assets > stake.depositToken.allowance && isGnosis) {
        openTransactionsFlowModal({
          flow: 'stake',
          onStart: ({ setTransaction }) => stake.submit({
            assets,
            depositToken: stake.depositToken,
            setTransaction,
          }),
        })
      }
      else {
        stake.submit({ assets })
      }
    }
  }, [ field, stake, isGnosis ])

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
