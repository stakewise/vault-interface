import React from 'react'
import forms from 'modules/forms'

import { Table } from 'views/SwapView/common'
import { swapCtx } from 'views/SwapView/util'

import { useInfo } from './util'
import SubmitButton from './SubmitButton/SubmitButton'
import MintTokenBalanceNote from './MintTokenBalanceNote/MintTokenBalanceNote'


type UnstakeContentProps = {
  className?: string
}

const UnstakeContent: React.FC<UnstakeContentProps> = (props) => {
  const { className } = props

  const { unstake } = swapCtx.useData()
  const items = useInfo()

  const { value, error } = forms.useFieldValue(unstake.field)

  if (!value || error) {
    return (
      <SubmitButton
        className={className}
        isDisabled
      />
    )
  }

  return (
    <div className={className}>
      <SubmitButton />
      <MintTokenBalanceNote />
      <Table
        className="mt-8"
        options={items}
      />
    </div>
  )
}


export default React.memo(UnstakeContent)
