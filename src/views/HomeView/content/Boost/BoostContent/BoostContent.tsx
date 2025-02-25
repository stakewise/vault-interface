import React from 'react'

import { ExitQueueNote } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import BoostInfo from './BoostInfo/BoostInfo'
import SubmitButton from './SubmitButton/SubmitButton'


type BoostContentProps = {
  className?: string
}

const BoostContent: React.FC<BoostContentProps> = (props) => {
  const { className } = props

  const { data } = stakeCtx.useData()

  return (
    <div className={className}>
      <SubmitButton />
      {
        data.boost.exitingPercent ? (
          <ExitQueueNote
            className="mt-8"
            action="boost"
          />
        ) : (
          <BoostInfo className="mt-8" />
        )
      }
    </div>
  )
}


export default React.memo(BoostContent)
