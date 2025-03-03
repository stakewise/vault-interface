import { useMemo } from 'react'
import { useFiatValues, useStore } from 'hooks'
import { commonMessages } from 'helpers'
import { formatEther } from 'ethers'
import { useConfig } from 'config'

import { TableProps } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition } from 'views/HomeView/content/util'
import useTransactionPrice from './useTransactionPrice'

import messages from './messages'


type Output = TableProps['options']

const storeSelector = (store: Store) => ({
  queueDays: store.mintToken.queueDays,
})

const useInfo = () => {
  const { sdk } = useConfig()
  const { unstake, field } = stakeCtx.useData()

  const { queueDays } = useStore(storeSelector)

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
