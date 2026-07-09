import React from 'react'
import { useStore } from 'hooks'
import forms from 'modules/forms'
import { commonMessages, constants } from 'helpers'

import { Table, StakeStats } from 'views/SwapView/common'
import { swapCtx } from 'views/SwapView/util'

import { Note, Href, Text } from 'components'

import { useOptions } from './util'


type BoostInfoProps = {
  className?: string
  transactionPrice: bigint
  openGuideModal: () => void
}

const storeSelector = (store: Store) => ({
  leverageStrategyData: store.vault.user.balances.boost.leverageStrategyData,
})

const BoostInfo: React.FC<BoostInfoProps> = (props) => {
  const { className, transactionPrice, openGuideModal } = props

  const { boost } = swapCtx.useData()
  const options = useOptions(transactionPrice)
  const { value, error } = forms.useFieldValue(boost.field)

  const { leverageStrategyData } = useStore(storeSelector)

  return (
    <div className={className}>
      {
        Boolean(value && !error) ? (
          <Table options={options}/>
        ) : (
          <StakeStats />
        )
      }
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
      <div className="flex justify-center mt-16">
        <Href
          className="hover:opacity-90 cursor-pointer px-4"
          tabIndex="0"
          onClick={openGuideModal}
        >
          <Text
            className="font-medium"
            message={commonMessages.buttonTitle.boostGuideLink}
            color="primary"
            size="sm"
          />
        </Href>
      </div>
    </div>
  )
}


export default React.memo(BoostInfo)
