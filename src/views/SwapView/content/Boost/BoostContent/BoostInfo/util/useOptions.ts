import { useMemo } from 'react'
import { useConfig } from 'config'
import { formatEther } from 'ethers'
import { useFiatValues } from 'hooks'
import { commonMessages } from 'helpers'

import { TableProps } from 'views/SwapView/common'


const useOptions = (gasPrice: bigint) => {
  const { sdk } = useConfig()

  const { fiatGas } = useFiatValues({
    fiatGas: {
      token: sdk.config.tokens.mintToken,
      value: formatEther(gasPrice),
      isMinimal: true,
    },
  })

  return useMemo<TableProps['options']>(() => {
    const initialOptions: TableProps['options'] = []

    if (gasPrice) {
      initialOptions.push({
        text: commonMessages.transaction.price,
        value: fiatGas.formattedValue,
        dataTestId: 'table-gas',
        icon: 'icon/gas',
      })
    }

    return initialOptions
  }, [ fiatGas, gasPrice ])
}


export default useOptions
