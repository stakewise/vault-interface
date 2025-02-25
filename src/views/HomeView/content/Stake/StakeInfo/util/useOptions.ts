import { useMemo } from 'react'
import { commonMessages } from 'helpers'
import { useFiatValues } from 'hooks'
import { formatEther } from 'ethers'
import { useConfig } from 'config'
import methods from 'sw-methods'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { TableProps } from 'views/HomeView/common'

import useData from './useData'

import messages from './messages'


const useOptions = () => {
  const { data } = stakeCtx.useData()
  const { address, sdk } = useConfig()

  const { gas, rate, newAPY, receive, isFetching } = useData()

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: formatEther(gas),
      isMinimal: true,
    },
  })

  const diff = data.apy.user - newAPY

  return useMemo<TableProps['options']>(() => {
    const rateAmount = methods.formatTokenValue(rate)
    const receiveAmount = methods.formatTokenValue(receive)

    const finallyApyResult = diff > 0.01
      ? {
        values: {
          prev: methods.formatApy(data.apy.user),
          next: methods.formatApy(newAPY),
        },
      }
      : {
        value: methods.formatApy(address ? newAPY : data.apy.mintToken),
      }

    const result: TableProps['options'] = [
      {
        ...finallyApyResult,
        text: commonMessages.apy,
        tooltip: {
          ...messages.tooltips.apy,
          values: {
            depositToken: sdk.config.tokens.depositToken,
          },
        },
        isFetching: isFetching,
        dataTestId: 'table-apy',
      },
      {
        text: messages.receive,
        value: `${receiveAmount} ${sdk.config.tokens.mintToken}`,
        tooltip: {
          ...messages.tooltips.receive,
          values: {
            mintToken: sdk.config.tokens.mintToken,
            depositToken: sdk.config.tokens.depositToken,
          },
        },
        isFetching,
        dataTestId: 'table-receive',
      },
      {
        text: commonMessages.transaction.exchangeRate,
        value: `1 ${sdk.config.tokens.depositToken} = ${rateAmount} ${sdk.config.tokens.mintToken}`,
        tooltip: {
          ...messages.tooltips.rate,
          values: {
            mintToken: sdk.config.tokens.mintToken,
            depositToken: sdk.config.tokens.depositToken,
          },
        },
        isFetching,
        dataTestId: 'table-rate',
      },
      {
        text: messages.fee,
        value: data.fee,
        tooltip: messages.tooltips.fee,
        isFetching,
        dataTestId: 'table-fee',
      },
    ]

    if (address) {
      result.push({
        text: commonMessages.transaction.networkCost,
        value: fiatGas.formattedValue,
        tooltip: {
          ...commonMessages.tooltip.gas,
          values: {
            nativeToken: sdk.config.tokens.nativeToken,
          },
        },
        isFetching,
        icon: 'icon/gas',
        dataTestId: 'table-gas',
      })
    }

    return result
  }, [ sdk, diff, newAPY, rate, receive, data, address, fiatGas, isFetching ])
}


export default useOptions
