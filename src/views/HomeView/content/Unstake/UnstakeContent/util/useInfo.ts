import { useMemo } from 'react'
import { useFiatValues, useStore } from 'hooks'
import { commonMessages } from 'helpers'
import { formatEther } from 'ethers'
import { useConfig } from 'config'
import methods from 'sw-methods'

import { TableProps } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import messages from './messages'


type Output = TableProps['options']

const storeSelector = (store: Store) => ({
  queueDays: store.mintToken.queueDays,
})

const useInfo = () => {
  const { sdk } = useConfig()
  const { unstake } = stakeCtx.useData()

  const { queueDays } = useStore(storeSelector)

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: formatEther(unstake.txData.gas),
      isMinimal: true,
    },
  })

  return useMemo<Output>(() => {
    const rateAmount = methods.formatTokenValue(unstake.txData.rate)

    let items: TableProps['options'] = [
      {
        text: commonMessages.transaction.exchangeRate,
        tooltip: {
          ...messages.tooltips.rate,
          values: {
            mintToken: sdk.config.tokens.mintToken,
            depositToken: sdk.config.tokens.depositToken,
          },
        },
        value: `1 ${sdk.config.tokens.mintToken} = ${rateAmount} ${sdk.config.tokens.depositToken}`,
        dataTestId: 'table-rate',
        isFetching: unstake.txData.isFetching,
      },
      {
        text: commonMessages.transaction.networkCost,
        tooltip: {
          ...commonMessages.tooltip.gas,
          values: {
            nativeToken: sdk.config.tokens.nativeToken,
          },
        },
        value: fiatGas.formattedValue,
        icon: 'icon/gas',
        dataTestId: 'table-gas',
        isFetching: unstake.txData.isFetching,
      },
    ]

    if (unstake.txData.vaultAssets && !unstake.txData.isFetching) {
      const vaultQueueAmount = methods.formatTokenValue(unstake.txData.vaultAssets)

      const item = {
        text: messages.queue,
        tooltip: {
          ...commonMessages.tooltip.queue,
          values: {
            queueDays,
            token: sdk.config.tokens.depositToken,
          },
        },
        value: `${vaultQueueAmount} ${sdk.config.tokens.depositToken}`,
        dataTestId: 'table-queue',
        isFetching: false,
      }

      items = [ item, ...items ]
    }

    if (unstake.txData.exchangeAssets && !unstake.txData.isFetching) {
      const exchangeQueueAmount = methods.formatTokenValue(unstake.txData.exchangeAssets)

      const item = {
        text: messages.exchanger,
        tooltip: {
          ...messages.tooltips.exchanger,
          values: {
            mintToken: sdk.config.tokens.mintToken,
            depositToken: sdk.config.tokens.depositToken,
          },
        },
        value: `${exchangeQueueAmount} ${sdk.config.tokens.depositToken}`,
        dataTestId: 'table-receive',
        isFetching: false,
      }

      items = [ item, ...items ]
    }

    return items
  }, [ sdk, unstake, fiatGas, queueDays ])
}


export default useInfo
