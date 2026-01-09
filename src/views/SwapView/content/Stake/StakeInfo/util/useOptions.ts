import { useMemo } from 'react'
import { useConfig } from 'config'
import { useFiatValues, useStore } from 'hooks'
import { formatEther, parseUnits } from 'ethers'
import { commonMessages, methods } from 'helpers'

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

  const assets = vaultHooks.helpers.useAssets({
    field: stake.field,
    type: 'stake',
  })

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: formatEther(stake.transactionPrice),
      isMinimal: true,
    },
  })

  const diff = userApy - newAPY

  const selectedToken = stake.swapTokens.sellToken

  const isFetching = receive.isFetching || isApyFetching

  return useMemo<TableProps['options']>(() => {
    const rateAmount = selectedToken.address
      ? stake.getSwappedDepositAmount(parseUnits('1', selectedToken.units))
      : undefined

    const result: TableProps['options'] = []

    if (assets) {
      result.push(assets)
    }

    if (rateAmount) {
      result.push({
        text: commonMessages.transaction.exchangeRate,
        value: `1 ${selectedToken.name} = ${methods.formatTokenValue(rateAmount)} ${sdk.config.tokens.depositToken}`,
        tooltip: {
          ...messages.tooltips.rate,
          values: {
            swapToken: selectedToken.name,
            depositToken: sdk.config.tokens.depositToken,
          },
        },
        isFetching,
        dataTestId: 'table-rate',
      })
    }

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
    stake,
    assets,
    newAPY,
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
