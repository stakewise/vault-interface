import { useCallback } from 'react'
import { constants } from 'helpers'
import { useConfig } from 'config'

import useTransactionGas from './useTransactionGas'



type Input = {
  gas: ReturnType<typeof useTransactionGas>['gas']
  field: Forms.Field<bigint>
  swapToken: SwapToken
}

const useMaxStake = (values: Input) => {
  const { gas, field, swapToken } = values

  const { isGnosis, activeWallet } = useConfig()

  const isGnosisSafeWallet = activeWallet === constants.walletNames.gnosisSafe
  const isNoGasTransaction = Boolean(isGnosis || isGnosisSafeWallet || swapToken.address)

  return useCallback(() => {
    const assets = swapToken.balance

    if (isNoGasTransaction) {
      field.setValue(assets)
    }
    else {
      const hasAmount = assets > 0

      if (hasAmount) {
        const total = assets - gas.approve - (gas.deposit * 2n)

        field.setValue(total > 0 ? total : 0n)
      }
      else {
        field.setValue(0n)
      }
    }
  }, [ gas, field, swapToken, isNoGasTransaction ])
}


export default useMaxStake
