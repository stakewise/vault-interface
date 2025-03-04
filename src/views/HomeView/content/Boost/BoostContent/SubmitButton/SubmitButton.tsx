import React, { useCallback } from 'react'
import forms from 'sw-modules/forms'
import { commonMessages } from 'helpers'
import { useBoostSupplyCapsCheck, useStore } from 'hooks'
import { useConfig } from 'config'

import { openTransactionsFlowModal } from 'layouts/modals'
import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'
import { Tooltip } from 'components'

import messages from './messages'


const storeSelector = (store: Store) => ({
  vaultApy: store.vault.base.data.apy,
  ltvPercent: store.vault.base.data.osTokenConfig.ltvPercent,
  maxBoostApy: store.vault.base.data.allocatorMaxBoostApy,
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { isGnosis } = useConfig()
  const { boost, field } = stakeCtx.useData()
  const { value, error } = forms.useFieldValue(field)
  const { vaultApy, ltvPercent, maxBoostApy, exitingPercent } = useStore(storeSelector)

  const { isFetching, checkSupplyCap } = useBoostSupplyCapsCheck({
    ltvPercent: BigInt(ltvPercent),
    skip: isGnosis,
  })

  const isDisabled = exitingPercent > 0
  const isNotProfitable = vaultApy >= maxBoostApy

  const title = isNotProfitable
    ? messages.notProfitable
    : commonMessages.buttonTitle.boost

  const isValidSupplyCap = error
    ? true
    : checkSupplyCap(value || 0n)

  const disabled = (
    isDisabled
    || isFetching
    || isNotProfitable
    || !isValidSupplyCap
    || boost.isSubmitting
    || boost.isAllowanceFetching
  )

  const handleClick = useCallback(() => {
    const amount = field.value || 0n
    const isPermitRequired = amount > boost.allowance

    if (isPermitRequired) {
      openTransactionsFlowModal({
        flow: 'boost',
        onStart: ({ setTransaction }) => boost.submit({ setTransaction }),
      })
    }
    else {
      boost.submit()
    }
  }, [ field, boost ])

  const button = (
    <Button
      className={className}
      title={title}
      disabled={disabled}
      color="color2"
      loading={boost.isAllowanceFetching}
      onClick={handleClick}
    />
  )

  if (!isValidSupplyCap) {
    return (
      <Tooltip content={commonMessages.invalidBoostSupplyCap}>
        {button}
      </Tooltip>
    )
  }

  return button
}


export default React.memo(SubmitButton)
