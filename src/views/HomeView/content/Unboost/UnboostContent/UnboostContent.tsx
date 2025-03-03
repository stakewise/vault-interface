import React from 'react'
import { useStore } from 'hooks'
import { commonMessages } from 'helpers'

import { Note } from 'components'

import { ExitQueueNote } from 'views/HomeView/common'

import UnboostInfo from './UnboostInfo/UnboostInfo'
import SubmitButton from './SubmitButton/SubmitButton'


const storeSelector = (store: Store) => ({
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

type UnboostContentProps = {
  className?: string
}

const UnboostContent: React.FC<UnboostContentProps> = (props) => {
  const { className } = props

  const { exitingPercent } = useStore(storeSelector)

  return (
    <div className={className}>
      <SubmitButton />
      {
        exitingPercent ? (
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
