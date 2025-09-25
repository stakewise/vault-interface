import React from 'react'
import { useStore } from 'hooks'

import { vaultHooks } from 'views/SwapView/util'
import { ClaimUnboostQueueNote } from 'views/SwapView/common'

import BoostInfo from './BoostInfo/BoostInfo'
import SubmitButton from './SubmitButton/SubmitButton'


type BoostParams = Pick<
  ReturnType<typeof vaultHooks.actions.useBoost>,
  'boostDisabledTooltip'
  | 'transactionPrice'
  | 'isBoostDisabled'
  | 'isBoostLoading'
  | 'openGuideModal'
  | 'submit'
  | 'field'
>

type BoostContentProps = BoostParams & {
  className?: string
}

const storeSelector = (store: Store) => ({
  boostExitingPercent: store.vault.user.balances.boost.exitingPercent,
})

const BoostContent: React.FC<BoostContentProps> = (props) => {
  const {
    className,
    field,
    isBoostLoading,
    isBoostDisabled,
    transactionPrice,
    boostDisabledTooltip,
    openGuideModal,
    submit,
  } = props

  const { boostExitingPercent } = useStore(storeSelector)

  return (
    <div className={className}>
      <SubmitButton
        boostDisabledTooltip={boostDisabledTooltip}
        isBoostDisabled={isBoostDisabled}
        isBoostLoading={isBoostLoading}
        field={field}
        submit={submit}
      />
      {
        boostExitingPercent ? (
          <ClaimUnboostQueueNote
            className="mt-8"
            action="boost"
          />
        ) : (
          <BoostInfo
            className="mt-8"
            openGuideModal={openGuideModal}
            transactionPrice={transactionPrice}
          />
        )
      }
    </div>
  )
}


export default React.memo(BoostContent)
