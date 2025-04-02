import React from 'react'
import { useConfig } from 'config'
import forms from 'modules/forms'

import { Table } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { useInfo } from './util'
import SubmitButton from './SubmitButton/SubmitButton'


type UnstakeContentProps = {
  className?: string
}

const UnstakeContent: React.FC<UnstakeContentProps> = (props) => {
  const { className } = props

  const { field } = stakeCtx.useData()
  const { address } = useConfig()
  const items = useInfo()

  const { value, error } = forms.useFieldValue(field)

  if (!value || error || !address) {
    return (
      <SubmitButton
        className="mt-8"
      />
    )
  }

  return (
    <div className={className}>
      <SubmitButton />
      <Table
        className="mt-8"
        options={items}
      />
    </div>
  )
}


export default React.memo(UnstakeContent)
