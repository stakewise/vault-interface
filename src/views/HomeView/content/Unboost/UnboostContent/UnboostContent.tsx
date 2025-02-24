import React from 'react'
import { commonMessages } from 'helpers'

import { Note } from 'components'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { ExitQueueNote } from 'views/HomeView/common'

import UnboostInfo from './UnboostInfo/UnboostInfo'
import SubmitButton from './SubmitButton/SubmitButton'


type UnboostContentProps = {
  className?: string
}

const UnboostContent: React.FC<UnboostContentProps> = (props) => {
  const { className } = props

  const { data } = stakeCtx.useData()

  return (
    <div className={className}>
      <SubmitButton />
      {
        data.boost.exitingPercent ? (
          <ExitQueueNote
            className="mt-8"
            action="unboost"
          />
        ) : (
          <UnboostInfo className="mt-8" />
        )
      }
      <Note
        className="mt-8"
        text={commonMessages.notification.unboostRequest}
      />
    </div>
  )
}


export default React.memo(UnboostContent)
