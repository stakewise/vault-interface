import { useCallback, useMemo, useEffect, useState } from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'
import { useAutoFetch, useStore } from 'hooks'

import useEstimateGas, { Type } from '../useEstimateGas'


const storeSelector = (store: Store) => ({
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

type Input = {
  vaultAddress: string | null
}

const useDepositGas = ({ vaultAddress }: Input) => {
  const { address } = useConfig()
  const { depositTokenBalance } = useStore(storeSelector)
  const [ depositGas, setDepositGas ] = useState<bigint>(0n)

  const getDepositGas = useEstimateGas(Type.Deposit)

  const handleGetDepositGas = useCallback(async () => {
    let depositGas = 0n

    const isValidBalance = depositTokenBalance > constants.blockchain.gwei

    try {
      if (isValidBalance && vaultAddress) {
        const amount = depositTokenBalance / 2n // try to check half of balance to get gas

        depositGas = await getDepositGas(amount)
      }
    }
    catch {}

    setDepositGas(depositGas)
  }, [ vaultAddress, depositTokenBalance, getDepositGas ])

  useEffect(() => {
    if (!address) {
      setDepositGas(0n)
    }
  }, [ address ])

  useAutoFetch({
    action: handleGetDepositGas,
    interval: 15_000,
    skip: !address,
  })

  return useMemo(() => ({
    depositGas,
  }), [
    depositGas,
  ])
}


export default useDepositGas
