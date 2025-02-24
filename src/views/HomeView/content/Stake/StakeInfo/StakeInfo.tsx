import React from 'react'

import { StakeStats, Table } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { FieldValid } from 'components'

import { useOptions } from './util'


type StakeInfoProps = {
  className?: string
}

const StakeInfo: React.FC<StakeInfoProps> = (props) => {
  const { className } = props

  const { field } = stakeCtx.useData()
  const options = useOptions()

  return (
    <FieldValid field={field} filled>
      {
        (isValid) => (
          isValid ? (
            <Table
              className={className}
              options={options}
            />
          ) : (
            <StakeStats className={className} />
          )
        )
      }
    </FieldValid>
  )
}


export default React.memo(StakeInfo)
