import React from 'react'
import { useStore } from 'hooks'
import { commonMessages } from 'helpers'

import { vaultHooks } from 'views/SwapView/util'
import { SubmitButtonWrapper } from 'views/SwapView/common'

import messages from './messages'


type BoostParams = Pick<
  ReturnType<typeof vaultHooks.actions.useBoost>,
  'submit' | 'field' | 'isBoostDisabled' | 'isBoostLoading' | 'boostDisabledTooltip'
>

type SubmitButtonProps = BoostParams & {
  className?: string
}

const storeSelector = (store: Store) => ({
  vaultApy: store.vault.base.data.apy,
  maxBoostApy: store.vault.base.data.allocatorMaxBoostApy,
})

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const {
    className,
    boostDisabledTooltip,
    isBoostDisabled,
    isBoostLoading,
    field,
    submit,
  } = props

  const { vaultApy, maxBoostApy } = useStore(storeSelector)

  const isNotProfitable = vaultApy >= maxBoostApy

  const title = isNotProfitable
    ? messages.notProfitable
    : commonMessages.buttonTitle.boost

  return (
    <SubmitButtonWrapper
      className={className}
      tooltip={boostDisabledTooltip}
      disabled={isBoostDisabled}
      loading={isBoostLoading}
      title={title}
      field={field}
      onClick={submit}
    />
  )
}


export default React.memo(SubmitButton)
