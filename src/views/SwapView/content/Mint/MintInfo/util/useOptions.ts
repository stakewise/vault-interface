import { useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { useFiatValues, useStore } from 'hooks'
import { commonMessages, methods } from 'helpers'

import { swapCtx, vaultHooks } from 'views/SwapView/util'
import { TableProps } from 'views/SwapView/common'

import messages from './messages'


const storeSelector = (store: Store) => ({
  mintTokenRate: store.mintToken.rate,
  userAPY: store.vault.user.balances.userAPY,
  protocolFeePercent: store.vault.base.data.protocolFeePercent,
})

const useOptions = () => {
  const { address, sdk, isReadOnlyMode } = useConfig()

  const { userAPY, protocolFeePercent, mintTokenRate } = useStore(storeSelector)

  const rate = methods.formatTokenValue(mintTokenRate)

  const percent = String(protocolFeePercent)


  const { mint } = swapCtx.useData()

  const { newAPY, isApyHidden, isFetching: isApyFetching } = vaultHooks.helpers.useAPY({
    field: mint.field,
    type: 'mint',
  })

  const shares = vaultHooks.helpers.useShares({
    field: mint.field,
    type: 'mint',
  })

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: formatEther(mint.transactionPrice),
      isMinimal: true,
    },
  })

  return useMemo<TableProps['options']>(() => {
    const result: TableProps['options'] = [
      {
        text: messages.conversionRate,
        value: `1 ${sdk.config.tokens.mintToken} = ${rate} ${sdk.config.tokens.depositToken}`,
      },
      {
        text: messages.stabilityFee,
        value: `${percent}%`,
        tooltip: {
          ...messages.tooltip.stabilityFee,
          values: {
            token: sdk.config.tokens.mintToken,
            percent,
          },
        },
      },
    ]

    if (shares) {
      result.push(shares)
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
        icon: 'icon/gas',
        dataTestId: 'table-gas',
        isFetching: isApyFetching,
      })
    }

    if (!isApyHidden) {
      result.unshift({
        values: {
          prev: methods.formatApy(userAPY),
          next: methods.formatApy(newAPY),
        },
        text: commonMessages.apy,
        isFetching: isApyFetching,
        dataTestId: 'table-apy',
      })
    }

    return result
  }, [
    sdk,
    rate,
    shares,
    newAPY,
    percent,
    address,
    fiatGas,
    userAPY,
    isApyHidden,
    isApyFetching,
    isReadOnlyMode,
  ])
}


export default useOptions
