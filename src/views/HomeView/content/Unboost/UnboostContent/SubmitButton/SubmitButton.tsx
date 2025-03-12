import React from 'react'
import { useStore } from 'hooks'
import { commonMessages } from 'helpers'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'


const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { data, unboost } = stakeCtx.useData()
  const { boostedShares, exitingPercent } = useStore(storeSelector)

  const isDisabled = exitingPercent > 0 || boostedShares === 0n

  return (
    <Button
      className={className}
      title={commonMessages.buttonTitle.unboost}
      color="primary"
      loading={data.isFetching}
      disabled={unboost.isSubmitting || isDisabled}
      onClick={unboost.submit}
    />
  )
}


export default React.memo(SubmitButton)
