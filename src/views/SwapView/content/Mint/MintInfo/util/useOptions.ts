import { useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { useFiatValues, useStore } from 'hooks'
import { commonMessages, methods } from 'helpers'

import { swapCtx, vaultHooks } from 'views/SwapView/util'
import { TableProps } from 'views/SwapView/common'


const storeSelector = (store: Store) => ({
  userAPY: store.vault.user.balances.userAPY,
})

const useOptions = () => {
  const { address, sdk, isReadOnlyMode } = useConfig()

  const { userAPY } = useStore(storeSelector)

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
    const result: TableProps['options'] = []

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
  }, [ address, fiatGas, isApyFetching, isApyHidden, isReadOnlyMode, newAPY, sdk, shares, userAPY ])
}


export default useOptions
