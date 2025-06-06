import { useRef, useMemo, useCallback } from 'react'
import { useStore, useChainChanged, useAddressChanged, useStakeField } from 'hooks'
import forms from 'modules/forms'

import { Tab } from './enum'


type Input = {
  tabs: StakePage.Tabs.Data
  minBalance: bigint
  depositTokenBalance: bigint
  getDepositAmount?: (value: bigint) => bigint
}


const storeSelector = (store: Store) => ({
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
  maxMintShares: store.vault.user.balances.mintToken.maxMintShares,
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
  maxWithdrawAssets: store.vault.user.balances.withdraw.maxAssets,
})

const useFields = (values: Input) => {
  const { tabs, minBalance, depositTokenBalance, getDepositAmount } = values

  const tabRef = useRef<Tab>(tabs.value)

  const {
    mintedShares,
    maxMintShares,
    mintTokenBalance,
    maxWithdrawAssets,
  } = useStore(storeSelector)

  const maxBalance = useMemo(() => {
    const isStake = tabs.value === Tab.Stake

    let balance = 0n

    if (isStake) {
      balance = depositTokenBalance
    }
    else if (tabs.value === Tab.Unstake) {
      balance = maxWithdrawAssets
    }
    else if (tabs.value === Tab.Mint) {
      balance = maxMintShares
    }
    else if (tabs.value === Tab.Burn) {
      balance = mintedShares > mintTokenBalance
        ? mintTokenBalance
        : mintedShares
    }
    else {
      balance = mintTokenBalance
    }

    return balance
  }, [
    tabs,
    mintedShares,
    maxMintShares,
    mintTokenBalance,
    maxWithdrawAssets,
    depositTokenBalance,
  ])

  const { field } = useStakeField({
    minBalance,
    maxBalance,
    getDepositAmount,
    withCapacityCheck: tabs.value === Tab.Stake,
  })

  const percentField = forms.useField<string>({
    valueType: 'string',
    initialValue: '',
  })

  const resetForm = useCallback(() => {
    field.reset()
    percentField.reset()
  }, [ field, percentField ])

  if (tabRef.current !== tabs.value) {
    resetForm()
    tabRef.current = tabs.value
  }

  useChainChanged(resetForm)
  useAddressChanged(resetForm)

  return useMemo(() => ({
    field,
    percentField,
  }), [
    field,
    percentField,
  ])
}


export default useFields
