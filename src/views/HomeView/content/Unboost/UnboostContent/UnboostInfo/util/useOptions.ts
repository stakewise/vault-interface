import {  useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { commonMessages } from 'helpers'
import { useFiatValues, useStore } from 'hooks'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition, Position } from '../../../../util'
import useUnboostGasPrice from './useUnboostGasPrice'
import useReceive from './useReceive'


const storeSelector = (store: Store) => ({
  queueDays: store.mintToken.queueDays,
})

const useOptions = () => {
  const { sdk } = useConfig()
  const { percentField, vaultAddress } = stakeCtx.useData()

  const gasPrice = useUnboostGasPrice({ vaultAddress })
  const { queueDays } = useStore(storeSelector)
  const { receiveShares, receiveAssets } = useReceive({ field: percentField })

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
    const amounts: { token: Tokens, value: bigint, dataTestId: string }[] = [
      {
        token: sdk.config.tokens.mintToken,
        value: receiveShares,
        dataTestId: 'receive-shares',
      },
    ]

    if (receiveAssets) {
      amounts.push({
        token: sdk.config.tokens.depositToken,
        value: receiveAssets,
        dataTestId: 'receive-rewards',
      })
    }

    const options: Position[] = [
      ...position,
      ...amounts.map(({ token, value, dataTestId }) => ({
        title: {
          ...commonMessages.exitingToken,
          values: { token },
        },
        tokenValue: {
          token,
          prev: { value, dataTestId },
          next: { value: null },
        },
        tooltip: {
          ...commonMessages.tooltip.queue,
          values: { token, queueDays },
        },
      })),
    ]

    if (fiatGas) {
      return [
        ...options,
        {
          title: commonMessages.transaction.price,
          textValue: {
            prev: {
              message: fiatGas.formattedValue,
              icon: 'icon/gas',
              dataTestId: 'gas',
            },
            next: {},
          },
          isFetching: !gasPrice,
        },
      ]
    }

    return options
  }, [ sdk, position, fiatGas, gasPrice, queueDays, receiveAssets, receiveShares ])
}


export default useOptions
