import { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useFiatValues } from 'hooks'
import { useConfig } from 'config'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition } from '../../../util'
import useTransactionPrice from './useTransactionPrice'


const useOptions = () => {
  const { field } = stakeCtx.useData()
  const { address, sdk } = useConfig()

  const transactionPrice = useTransactionPrice()

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: transactionPrice,
      isMinimal: true,
    },
  })

  const position = usePosition({
    type: 'mint',
    field,
  })

  return useMemo(() => {
    if (address) {
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
    }

    return position
  }, [ sdk, fiatGas, address, transactionPrice, position ])
}


export default useOptions
