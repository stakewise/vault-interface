import { useCallback, useEffect, useState } from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'
import { useAutoFetch, useStore } from 'hooks'

import useEstimateGas, { Type } from '../useEstimateGas'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

const useStakeGas = () => {
  const { address } = useConfig()
  const [ gas, setGas ] = useState<bigint>(0n)
  const { vaultAddress, depositTokenBalance } = useStore(storeSelector)

  const getDepositGas = useEstimateGas(Type.Deposit)

  const handleGetDepositGas = useCallback(async () => {
    let gas = 0n

    const isValidBalance = depositTokenBalance > constants.blockchain.gwei

    try {
      if (isValidBalance && vaultAddress) {
        const amount = depositTokenBalance / 2n // try to check half of balance to get gas

        gas = await getDepositGas(amount)
      }
    }
    catch {}

    setGas(gas)
  }, [ vaultAddress, depositTokenBalance, getDepositGas ])

  useEffect(() => {
    if (!address) {
      setGas(0n)
    }
  }, [ address ])

  useAutoFetch({
    action: handleGetDepositGas,
    interval: 15_000,
    skip: !address,
  })

  return gas
}


export default useStakeGas
