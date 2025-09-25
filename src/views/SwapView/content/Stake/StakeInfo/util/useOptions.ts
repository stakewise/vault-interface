import { useMemo } from 'react'
import { commonMessages, methods } from 'helpers'
import { useFiatValues, useStore } from 'hooks'
import { formatEther } from 'ethers'
import { useConfig } from 'config'

import { TableProps } from 'views/SwapView/common'
import { swapCtx, vaultHooks } from 'views/SwapView/util'

import messages from './messages'


const storeSelector = (store: Store) => ({
  apy: store.vault.base.data.apy,
  userApy: store.vault.user.balances.userAPY,
})

const useOptions = () => {
  const { address, sdk, isReadOnlyMode } = useConfig()

  const { stake } = swapCtx.useData()

  const { newAPY, isApyHidden, isFetching: isApyFetching } = vaultHooks.helpers.useAPY({
    field: stake.field,
    type: 'stake',
    modifier: stake.getSwappedDepositAmount,
  })

  const { apy, userApy } = useStore(storeSelector)
  const receive = vaultHooks.helpers.useStakeReceive(stake)

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: formatEther(stake.transactionPrice),
      isMinimal: true,
    },
  })

  const diff = userApy - newAPY
  const selectedToken = stake.swapTokens.selected.name

  const isFetching = receive.isFetching || isApyFetching

  return useMemo<TableProps['options']>(() => {
    const rateAmount = methods.formatTokenValue(receive.exchangeRate, true)
    const receiveAmount = methods.formatTokenValue(receive.receiveShares)

    const result: TableProps['options'] = [
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
        value: `1 ${selectedToken} = ${rateAmount} ${sdk.config.tokens.mintToken}`,
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
    ]

    if (address && !isReadOnlyMode) {
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

    if (!isApyHidden) {
      const finallyApyResult = (diff > 0.01 || (!userApy && diff < 0))
        ? {
          values: {
            prev: methods.formatApy(userApy),
            next: methods.formatApy(newAPY),
          },
        }
        : {
          value: methods.formatApy(address ? newAPY : apy),
        }

      result.unshift({
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
      })
    }

    return result
  }, [
    sdk,
    apy,
    diff,
    newAPY,
    receive,
    userApy,
    address,
    fiatGas,
    isFetching,
    isApyHidden,
    selectedToken,
    isReadOnlyMode,
  ])
}


export default useOptions
