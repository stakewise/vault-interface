import {  useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { useFiatValues } from 'hooks'
import { commonMessages, methods } from 'helpers'

import { swapCtx, vaultHooks } from 'views/SwapView/util'
import { TableProps } from 'views/SwapView/common'


const useOptions = () => {
  const { sdk } = useConfig()
  const { unboost } = swapCtx.useData()
  const [ queueDays, queueDaysTooltip ] = vaultHooks.helpers.useQueueDays()

  const { fiatTransactionPrice } = useFiatValues({
    fiatTransactionPrice: {
      value: formatEther(unboost.transactionPrice),
      token: sdk.config.tokens.mintToken,
      isMinimal: true,
    },
  })

  const {
    receiveShares,
    receiveAssets,
  } = vaultHooks.helpers.useUnboostReceive(unboost.percentField)

  const isFetching = unboost.isUnboostLoading

  return useMemo(() => {
    const options: TableProps['options'] = [
      {
        text: {
          ...commonMessages.exitingToken,
          values: {
            token: sdk.config.tokens.mintToken,
          },
        },
        value: `${methods.formatTokenValue(receiveShares)} ${sdk.config.tokens.mintToken}`,
        tooltip: {
          ...commonMessages.tooltip.queue,
          values: {
            token: sdk.config.tokens.mintToken,
          },
        },
        isFetching,
        dataTestId: 'table-exiting-shares',
      },
      {
        text: commonMessages.exitDuration,
        tooltip: queueDaysTooltip,
        value: queueDays,
        dataTestId: 'table-exit-time',
      },
    ]

    if (Number(receiveAssets)) {
      options.push({
        text: {
          ...commonMessages.exitingToken,
          values: {
            token: sdk.config.tokens.depositToken,
          },
        },
        tooltip: {
          ...commonMessages.tooltip.queue,
          values: {
            token: sdk.config.tokens.depositToken,
          },
        },
        value: `${methods.formatTokenValue(receiveAssets)} ${sdk.config.tokens.depositToken}`,
        isFetching,
        dataTestId: 'table-exiting-rewards',
      })
    }

    if (fiatTransactionPrice) {
      options.push({
        text: commonMessages.transaction.price,
        value: fiatTransactionPrice.formattedValue,
        isFetching,
        icon: 'icon/gas',
        dataTestId: 'table-gas',
      })
    }

    return options
  }, [
    sdk,
    queueDays,
    isFetching,
    receiveShares,
    receiveAssets,
    queueDaysTooltip,
    fiatTransactionPrice,
  ])
}


export default useOptions
