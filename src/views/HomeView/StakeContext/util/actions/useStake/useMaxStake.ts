import { useCallback } from 'react'
import { constants } from 'helpers'
import { useConfig } from 'config'

import useEstimateGas from '../useEstimateGas'


type Input = {
  getDepositGas: ReturnType<typeof useEstimateGas>
}

const useMaxStake = (values: Input) => {
  const { getDepositGas } = values

  const { isGnosis, activeWallet } = useConfig()

  const isGnosisSafeWallet = activeWallet === constants.walletNames.gnosisSafe
  const isNoGasTransaction = isGnosis || isGnosisSafeWallet

  return useCallback(async (assets: bigint) => {
    if (isNoGasTransaction) {
      return assets
    }

    const hasAmount = assets > 0

    if (hasAmount) {
      const gas = await getDepositGas(assets)

      const total = assets - (gas * 2n)

      return total > 0 ? total : 0n
    }

    return 0n
  }, [ isNoGasTransaction, getDepositGas ])
}


export default useMaxStake
