import { useMemo } from 'react'
import methods from 'sw-methods'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { commonMessages } from 'helpers'
import { useBoostGasPrice, useFiatValues, useStore } from 'hooks'

import { stakeCtx } from 'views/HomeView/StakeContext/util'
import { useAPY } from 'views/HomeView/content/util'
import { TableProps } from 'views/HomeView/common'

import messages from './messages'


const storeSelector = (store: Store) => ({
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
})

const useOptions = () => {
  const { sdk } = useConfig()
  const { newAPY, isFetching } = useAPY('boost')
  const { data, vaultAddress } = stakeCtx.useData()
  const { mintTokenBalance } = useStore(storeSelector)

  const diff = newAPY - data.apy.user

  const gasPrice = useBoostGasPrice({ vaultAddress, mintTokenBalance })

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.mintToken,
      value: formatEther(gasPrice),
      isMinimal: true,
    },
  })

  return useMemo<TableProps['options']>(() => {
    const finallyApyResult = diff > 0.01
      ? {
        values: {
          prev: methods.formatApy(data.apy.user),
          next: methods.formatApy(newAPY),
        },
        isMagicValue: true,
      }
      : {
        isMagicValue: false,
        value: methods.formatApy(data.apy.user),
      }

    const initialOptions: TableProps['options'] = [
      {
        ...finallyApyResult,
        text: commonMessages.apy,
        tooltip: {
          ...messages.tooltip,
          values: {
            value: methods.formatApy(diff),
            mintToken: sdk.config.tokens.mintToken,
            depositToken: sdk.config.tokens.depositToken,
          },
        },
        isFetching,
        dataTestId: 'table-apy',
      },
    ]

    if (gasPrice) {
      initialOptions.push({
        text: commonMessages.transaction.price,
        value: fiatGas.formattedValue,
        dataTestId: 'table-gas',
        icon: 'icon/gas',
      })
    }

    return initialOptions
  }, [ data, diff, fiatGas, gasPrice, isFetching, newAPY, sdk ])
}


export default useOptions
