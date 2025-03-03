// import { useMemo } from 'react'
// import { useConfig } from 'config'
// import { formatEther } from 'ethers'
// import { commonMessages } from 'helpers'
// import { useBoostGasPrice, useFiatValues, useStore } from 'hooks'

import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { usePosition } from '../../../../util'


// const storeSelector = (store: Store) => ({
//   mintTokenBalance: store.account.balances.data.mintTokenBalance,
// })

const useOptions = () => {
  // const { sdk, address } = useConfig()
  // const { mintTokenBalance } = useStore(storeSelector)
  const { vaultAddress, field } = stakeCtx.useData()

  return usePosition({
    type: 'boost',
    field,
  })

  // const gasPrice = useBoostGasPrice({ vaultAddress, mintTokenBalance })
  //
  // const { fiatGas } = useFiatValues({
  //   fiatGas: {
  //     token: sdk.config.tokens.mintToken,
  //     value: formatEther(gasPrice),
  //     isMinimal: true,
  //   },
  // })

  // return useMemo(() => {
  //   if (address) {
  //     return [
  //       ...position,
  //       {
  //         text: commonMessages.transaction.price,
  //         value: fiatGas.formattedValue,
  //         icon: 'icon/gas',
  //         isFetching: !gasPrice,
  //       },
  //     ]
  //   }
  //
  //   return position
  // }, [ address, fiatGas, gasPrice, position ])
}


export default useOptions
