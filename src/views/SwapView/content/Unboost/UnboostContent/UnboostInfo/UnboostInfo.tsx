import React from 'react'
import forms from 'modules/forms'

import { Table } from 'views/SwapView/common'
import { swapCtx } from 'views/SwapView/util'

import { useOptions } from './util'


type BaseViewProps = {
  className?: string
}

const UnboostInfo: React.FC<BaseViewProps> = (props) => {
  const { className } = props

  const options = useOptions()
  const { unboost } = swapCtx.useData()

  const { value } = forms.useFieldValue(unboost.percentField)

  if (!value) {
    return null
  }

  return (
    <Table
      className={className}
      options={options}
    />
  )
}


export default React.memo(UnboostInfo)
