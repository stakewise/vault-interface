import React from 'react'
import forms from 'modules/forms'
import { useConfig } from 'config'

import { Table } from 'views/SwapView/common'
import { swapCtx } from 'views/SwapView/util'

import { useOptions } from './util'


type MintInfoProps = {
  className?: string
}

const BurnInfo: React.FC<MintInfoProps> = (props) => {
  const { className } = props

  const { address } = useConfig()
  const { burn } = swapCtx.useData()
  const { value, error } = forms.useFieldValue(burn.field)

  const options = useOptions()

  if (!value || error || !address) {
    return null
  }

  return (
    <Table
      className={className}
      options={options}
    />
  )
}


export default React.memo(BurnInfo)
