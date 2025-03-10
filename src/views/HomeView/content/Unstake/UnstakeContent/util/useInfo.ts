import { useMemo } from 'react'
import { useFiatValues } from 'hooks'
import { commonMessages } from 'helpers'
import { useConfig } from 'config'

import { TableProps } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition } from 'views/HomeView/content/util'
import useTransactionPrice from './useTransactionPrice'


type Output = TableProps['options']

const useInfo = () => {
  const { sdk } = useConfig()
  const { field } = stakeCtx.useData()

  const transactionPrice = useTransactionPrice()

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

  return useMemo<Output>(() => {
    return [
      ...position,
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
    ]
  }, [ sdk, fiatGas, transactionPrice, position ])
}


export default useInfo
