import React from 'react'
import forms from 'modules/forms'

import { StakeStats, Table } from 'views/SwapView/common'
import { swapCtx } from 'views/SwapView/util'

import { useOptions } from './util'


type StakeInfoProps = {
  className?: string
}

const StakeInfo: React.FC<StakeInfoProps> = (props) => {
  const { className } = props

  const { stake } = swapCtx.useData()
  const options = useOptions()
  const { value } = forms.useFieldValue(stake.field)

  if (value) {
    return (
      <Table
        className={className}
        options={options}
      />
    )
  }

  return (
    <StakeStats className={className} />
  )
}


export default React.memo(StakeInfo)
