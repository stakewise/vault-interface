import {  useMemo } from 'react'
import methods from 'sw-methods'
import { useConfig } from 'config'
import forms from 'sw-modules/forms'
import { formatEther } from 'ethers'
import { commonMessages, modifiers } from 'helpers'
import { useFiatValues, useStore, useUnboostGasPrice } from 'hooks'

import { TableProps } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition } from '../../../../util'


const storeSelector = (store: Store) => ({
  queueDays: store.mintToken.queueDays,
})

const useOptions = () => {
  const { sdk } = useConfig()
  // const { queueDays } = useStore(storeSelector)
  const { data, percentField, vaultAddress, field } = stakeCtx.useData()
  // const { value: percent } = forms.useFieldValue<string>(percentField)

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

  // const { exitShares, exitAssets } = useMemo(() => {
  //   const [ exitShares ] = modifiers.splitPercent(data.boost.shares, percent)
  //   const [ exitAssets ] = modifiers.splitPercent(data.boost.rewardAssets, percent)
  //
  //   return {
  //     exitShares: methods.formatTokenValue(exitShares),
  //     exitAssets: methods.formatTokenValue(exitAssets),
  //   }
  // }, [ data, percent ])

  // const isFetching = data.isFetching

  return useMemo(() => {
    const options: TableProps['options'] = [
      // {
      //   text: commonMessages.yourApy,
      //   value: methods.formatApy(data.apy.user),
      //   dataTestId: 'table-apy',
      // },
      // {
      //   text: {
      //     ...commonMessages.exitingToken,
      //     values: {
      //       token: sdk.config.tokens.mintToken,
      //     },
      //   },
      //   value: `${exitShares} ${sdk.config.tokens.mintToken}`,
      //   tooltip: {
      //     ...commonMessages.tooltip.queue,
      //     values: {
      //       queueDays,
      //       token: sdk.config.tokens.mintToken,
      //     },
      //   },
      //   isFetching,
      //   dataTestId: 'table-exiting-shares',
      // },
    ]

    // if (Number(exitAssets)) {
    //   options.push({
    //     text: {
    //       ...commonMessages.exitingToken,
    //       values: {
    //         token: sdk.config.tokens.depositToken,
    //       },
    //     },
    //     tooltip: {
    //       ...commonMessages.tooltip.queue,
    //       values: {
    //         queueDays,
    //         token: sdk.config.tokens.depositToken,
    //       },
    //     },
    //     value: `${exitAssets} ${sdk.config.tokens.depositToken}`,
    //     isFetching,
    //     dataTestId: 'table-exiting-rewards',
    //   })
    // }

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
