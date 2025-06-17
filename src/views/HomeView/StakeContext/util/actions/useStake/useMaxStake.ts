import { useCallback } from 'react'
import { constants } from 'helpers'
import { useConfig } from 'config'


type Input = {
  approveGas: bigint
  depositGas: bigint
  field: Forms.Field<bigint>
  swapToken: SwapToken
}

const useMaxStake = ({ approveGas, depositGas, field, swapToken }: Input) => {
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
        const total = assets - approveGas - (depositGas * 2n)

        field.setValue(total > 0 ? total : 0n)
      }
      else {
        field.setValue(0n)
      }
    }
  }, [ field, approveGas, depositGas, swapToken, isNoGasTransaction ])
}


export default useMaxStake
