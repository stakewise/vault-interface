import React from 'react'
import forms from 'modules/forms'

import { Table } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { useOptions } from './util'


type BaseViewProps = {
  className?: string
}

const UnboostInfo: React.FC<BaseViewProps> = (props) => {
  const { className } = props

  const options = useOptions()
  const { percentField } = stakeCtx.useData()

  const { value } = forms.useFieldValue(percentField)

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
