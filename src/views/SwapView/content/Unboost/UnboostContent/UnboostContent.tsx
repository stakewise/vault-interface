import React from 'react'
import { useStore } from 'hooks'
import { commonMessages, constants } from 'helpers'

import { Note } from 'components'
import { ClaimUnboostQueueNote } from 'views/SwapView/common'

import UnboostInfo from './UnboostInfo/UnboostInfo'
import SubmitButton from './SubmitButton/SubmitButton'


type UnboostContentProps = {
  className?: string
}

const storeSelector = (store: Store) => ({
  boostExitingPercent: store.vault.user.balances.boost.exitingPercent,
  leverageStrategyData: store.vault.user.balances.boost.leverageStrategyData,
})

const UnboostContent: React.FC<UnboostContentProps> = (props) => {
  const { className } = props

  const { boostExitingPercent, leverageStrategyData } = useStore(storeSelector)

  return (
    <div className={className}>
      <SubmitButton />
      {
        boostExitingPercent ? (
          <ClaimUnboostQueueNote
            className="mt-8"
            action="unboost"
          />
        ) : (
          <>
            <UnboostInfo className="mt-8" />
            {
              leverageStrategyData.isUpgradeRequired && (
                <Note
                  className="mt-24"
                  text={commonMessages.notification.boostUpgrade}
                  link={constants.links.boostUpgrade} // ?
                  type="warning"
                  center
                />
              )
            }
          </>
        )
      }
    </div>
  )
}


export default React.memo(UnboostContent)
