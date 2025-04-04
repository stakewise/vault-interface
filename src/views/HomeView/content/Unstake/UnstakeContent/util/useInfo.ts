import { useMemo } from 'react'
import { useFiatValues, useStore } from 'hooks'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition, Position } from 'views/HomeView/content/util'
import useTransactionPrice from './useTransactionPrice'

import messages from './messages'
import forms from 'modules/forms'


const storeSelector = (store: Store) => ({
  queueDays: store.mintToken.queueDays,
  isV2Version: store.vault.base.data.versions.isV2Version,
  isCollateralized: store.vault.base.data.isCollateralized,
})

const useInfo = () => {
  const { sdk } = useConfig()
  const { field } = stakeCtx.useData()

  const { value } = forms.useFieldValue(field)
  const transactionPrice = useTransactionPrice()
  const { isV2Version, queueDays, isCollateralized } = useStore(storeSelector)

  const message = isV2Version
    ? commonMessages.tooltip.unstakeQueueV2
    : commonMessages.tooltip.unstakeQueueV1

  const tooltip = {
    ...message,
    values: {
      queueDays,
      depositToken: sdk.config.tokens.depositToken,
    },
  }

  const position = usePosition({
    type: 'unstake',
    field,
  })

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: transactionPrice,
      isMinimal: true,
    },
  })

  return useMemo<Position[]>(() => {
    return [
      ...position,
      {
        title: isCollateralized ? commonMessages.buttonTitle.unstakeQueue : messages.immediate,
        tooltip,
        tokenValue: {
          token: sdk.config.tokens.depositToken,
          prev: { value, dataTestId: 'unstake-queue' },
          next: { value: null },
        },
      },
      {
        title: commonMessages.transaction.networkCost,
        textValue: {
          prev: {
            message: fiatGas.formattedValue,
            icon: 'icon/gas',
          },
          next: {},
        },
        tooltip: {
          ...commonMessages.tooltip.gas,
          values: {
            nativeToken: sdk.config.tokens.nativeToken,
          },
        },
        isFetching: !transactionPrice,
      },
    ] as Position[]
  }, [ sdk, value, tooltip, fiatGas, transactionPrice, position, isCollateralized ])
}


export default useInfo
