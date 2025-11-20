import { useCallback, useMemo } from 'react'
import { useStore, useBalances, useSubgraphUpdate } from 'hooks'
import { StakeStep } from 'helpers/enums'
import { useConfig } from 'config'
import { getters } from 'helpers'

import Transactions from 'components/Transactions/Transactions'
import type { SetTransaction } from 'components/Transactions/types'
import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'

import vaultHooks from '../../../index'


const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
})

type ActionInput = {
  assets: bigint
  setTransaction: SetTransaction
}

type Input = {
  field: Forms.Field<bigint>
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const useStakeActions = (values: Input) => {
  const { fetchAllUserData } = values

  const { vaultAddress } = useStore(storeSelector)
  const { signSDK, address, chainId, cancelOnChange } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const { refetchNativeTokenBalance, refetchDepositTokenBalance } = useBalances()

  const stake = useCallback(async (values: ActionInput) => {
    const { assets, setTransaction } = values

    if (!assets || !address) {
      return
    }

    try {
      setTransaction(StakeStep.Stake, Transactions.Status.Confirm)

      const onSuccess = () => cancelOnChange({
        address,
        chainId,
        logic: () => {
          fetchAllUserData()
          refetchNativeTokenBalance()
          refetchDepositTokenBalance()

          const tokens = [
            {
              token: signSDK.config.tokens.depositToken,
              action: Action.Stake,
              value: assets,
            },
          ]

          openTxCompletedModal({ tokens, hash })
        },
      })

      const referrerAddress = getters.getReferrer()

      const hash = await signSDK.vault.deposit({
        userAddress: address as string,
        assets,
        vaultAddress,
        referrerAddress,
      })

      setTransaction(StakeStep.Stake, Transactions.Status.Processing)

      if (hash) {
        await subgraphUpdate({ hash })
        await onSuccess()

        setTransaction(StakeStep.Stake, Transactions.Status.Success)
      }
      else {
        setTransaction(StakeStep.Stake, Transactions.Status.Fail)

        return Promise.reject('TxHash is not defined')
      }
    }
    catch (error) {
      setTransaction(StakeStep.Stake, Transactions.Status.Fail)

      return Promise.reject(error)
    }
  }, [
    signSDK,
    chainId,
    address,
    vaultAddress,
    subgraphUpdate,
    cancelOnChange,
    fetchAllUserData,
    refetchNativeTokenBalance,
    refetchDepositTokenBalance,
  ])

  return useMemo(() => ({
    stake,
  }), [
    stake,
  ])
}


export default useStakeActions
