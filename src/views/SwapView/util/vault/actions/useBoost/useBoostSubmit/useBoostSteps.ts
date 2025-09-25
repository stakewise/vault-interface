import { useCallback } from 'react'
import { useStore } from 'hooks'
import { BoostStep } from 'helpers/enums'
import { commonMessages, constants } from 'helpers'

import type { StepsData } from 'components'


type Input = {
  allowance: bigint
  permitAddress: string | null
}

const storeSelector = (store: Store) => ({
  leverageStrategyData: store.vault.user.balances.boost.leverageStrategyData,
})

const useBoostSteps = (values: Input) => {
  const { allowance, permitAddress } = values

  const { leverageStrategyData } = useStore(storeSelector)

  return useCallback((amount: bigint) => {
    const result: StepsData = []

    if (leverageStrategyData.isUpgradeRequired) {
      result.push({
        id: BoostStep.Upgrade,
        title: commonMessages.upgradeLeverageStrategy,
      })
    }

    const isPermitRequired = amount > allowance

    if (permitAddress && isPermitRequired) {
      result.push({
        id: BoostStep.Permit,
        title: {
          ...commonMessages.buttonTitle.approve,
          values: {
            token: constants.tokens.osETH,
          },
        },
      })
    }

    result.push({
      id: BoostStep.Boost,
      title: commonMessages.buttonTitle.boost,
    })

    return result
  }, [ allowance, permitAddress, leverageStrategyData ])
}


export default useBoostSteps
