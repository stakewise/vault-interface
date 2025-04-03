import {  useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { commonMessages } from 'helpers'
import { useFiatValues } from 'hooks'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition, Position } from '../../../../util'
import useUnboostGasPrice from './useUnboostGasPrice'


const useOptions = () => {
  const { sdk } = useConfig()
  const { percentField, vaultAddress } = stakeCtx.useData()

  const gasPrice = useUnboostGasPrice({ vaultAddress })

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.mintToken,
      value: formatEther(gasPrice),
      isMinimal: true,
    },
  })

  const position = usePosition({
    type: 'unboost',
    field: percentField,
  })

  return useMemo<Position[]>(() => {
    if (fiatGas) {
      return [
        ...position,
        {
          title: commonMessages.transaction.price,
          textValue: {
            prev: {
              message: fiatGas.formattedValue,
              icon: 'icon/gas',
            },
            next: {},
          },
          isFetching: !gasPrice,
          dataTestId: 'table-gas',
        },
      ]
    }

    return position
  }, [ position, fiatGas, gasPrice ])
}


export default useOptions
