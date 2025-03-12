import React from 'react'
import { useStore } from 'hooks'

import { ExitQueueNote } from 'views/HomeView/common'

import BoostInfo from './BoostInfo/BoostInfo'
import SubmitButton from './SubmitButton/SubmitButton'


const storeSelector = (store: Store) => ({
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

type BoostContentProps = {
  className?: string
}

const BoostContent: React.FC<BoostContentProps> = (props) => {
  const { className } = props

  const { exitingPercent } = useStore(storeSelector)

  return (
    <div className={className}>
      <SubmitButton />
      {
        exitingPercent ? (
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
