import React, { useCallback } from 'react'
import froms from 'sw-modules/forms'
import { commonMessages } from 'helpers'

import { openTransactionsFlowModal } from 'layouts/modals'
import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { Button } from 'views/HomeView/common'
import { Tooltip } from 'components'

import messages from './messages'


type SubmitButtonProps = {
  className?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { className } = props

  const { data, boost, field } = stakeCtx.useData()
  const { value, error } = froms.useFieldValue(field)

  const isDisabled = data.boost.exitingPercent > 0
  const isNotProfitable = data.apy.mintToken >= data.apy.maxBoost

  const title = isNotProfitable
    ? messages.notProfitable
    : commonMessages.buttonTitle.boost

  const isValidSupplyCap = error
    ? true
    : boost.checkSupplyCap(value || 0n)

  const disabled = (
    isDisabled
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
      color="fancy-sunset"
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
