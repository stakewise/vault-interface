import React from 'react'
import froms from 'sw-modules/forms'
import { useConfig } from 'config'

import { StakeStats, Table } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { useOptions } from './util'


type MintInfoProps = {
  className?: string
}

const MintInfo: React.FC<MintInfoProps> = (props) => {
  const { className } = props

  const { address } = useConfig()
  const { field } = stakeCtx.useData()
  const { value, error } = froms.useFieldValue(field)

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


export default React.memo(MintInfo)
