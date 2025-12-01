import { useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { useFiatValues, useStore } from 'hooks'
import { commonMessages, methods } from 'helpers'

import { swapCtx, vaultHooks } from 'views/SwapView/util'
import { TableProps } from 'views/SwapView/common'

import messages from './messages'


type Output = TableProps['options']

const storeSelector = (store: Store) => ({
  queueDays: store.mintToken.queueDays,
  userApy: store.vault.user.balances.userAPY,
  vaultVersion: store.vault.base.data.versions.version,
  isV2Version: store.vault.base.data.versions.isV2Version,
  isCollateralized: store.vault.base.data.isCollateralized,
})

const useOptions = () => {
  const { unstake } = swapCtx.useData()
  const { sdk, address, isReadOnlyMode, isGnosis, isEthereum } = useConfig()

  const {
    userApy,
    queueDays,
    isV2Version,
    vaultVersion,
    isCollateralized,
  } = useStore(storeSelector)

  const { newAPY, isApyHidden, isFetching: isApyFetching } = vaultHooks.helpers.useAPY({
    type: 'unstake',
    field: unstake.field,
  })

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.nativeToken,
      value: formatEther(unstake.transactionPrice),
      isMinimal: true,
    },
  })

  const assets = vaultHooks.helpers.useAssets({
    field: unstake.field,
    type: 'unstake',
  })

  const noteMessage = useMemo(() => {
    return {
      ...(isV2Version
          ? commonMessages.tooltip.unstakeQueueV2
          : commonMessages.tooltip.unstakeQueueV1
      ),
      values: {
        queueDays,
        depositToken: sdk.config.tokens.depositToken,
      },
    }
  }, [ isV2Version, queueDays, sdk ])

  const isImmediateInGnosis = isGnosis && vaultVersion >= 3 && !isCollateralized
  const isImmediateInEthereum = !isV2Version && isEthereum && !isCollateralized

  const isImmediate = isImmediateInGnosis || isImmediateInEthereum

  return useMemo<Output>(() => {
    const items: TableProps['options'] = []

    const fieldAmount = methods.formatTokenValue(unstake.field.value || 0n)

    if (isImmediate) {
      items.push({
        text: messages.immediate,
        value: fieldAmount,
        logo: `token/${sdk.config.tokens.depositToken}`,
        dataTestId: 'table-unstake-queue',
      })
    }
    else {
      items.push({
        text: commonMessages.buttonTitle.unstakeQueue,
        tooltip: noteMessage,
        value: fieldAmount,
        logo: `token/${sdk.config.tokens.depositToken}`,
        dataTestId: 'table-unstake-queue',
      })
    }

    if (assets) {
      items.push(assets)
    }

    if (address && !isReadOnlyMode) {
      items.push({
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
        isFetching: isApyFetching,
      } as TableProps['options'][number])
    }

    if (!isApyHidden) {
      items.unshift({
        values: {
          prev: methods.formatApy(userApy),
          next: methods.formatApy(newAPY),
        },
        text: commonMessages.apy,
        isFetching: isApyFetching,
        dataTestId: 'table-apy',
      })
    }

    return items
  }, [
    address,
    assets,
    fiatGas,
    isApyFetching,
    isApyHidden,
    isImmediate,
    isReadOnlyMode,
    newAPY,
    noteMessage,
    sdk,
    unstake,
    userApy,
  ])
}


export default useOptions
