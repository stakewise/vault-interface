import { useRef, useMemo, useCallback } from 'react'
import { useStore, useChainChanged, useAddressChanged } from 'hooks'
import forms from 'sw-modules/forms'
import { useConfig } from 'config'

import { Tab } from './enum'
import emptyBalance from './emptyBalance'


type Input = {
  tabs: StakePage.Tabs.Data
}

type Fields = {
  field: bigint
  percentField: string
}

const storeSelector = (store: Store) => ({
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
  maxMintShares: store.vault.user.balances.mintToken.maxMintShares,
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
  maxWithdrawAssets: store.vault.user.balances.withdraw.maxAssets,
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

const useFields = (values: Input) => {
  const { tabs } = values

  const { address } = useConfig()
  const {
    mintedShares,
    maxMintShares,
    mintTokenBalance,
    maxWithdrawAssets,
    depositTokenBalance,
  } = useStore(storeSelector)

  const isStake = tabs.value === Tab.Stake

  let balance = 0n

  if (address || !isStake) {
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
  }
  else {
    balance = emptyBalance
  }

  const balanceRef = useRef(balance)
  balanceRef.current = balance

  const tabRef = useRef<Tab>(tabs.value)

  const form = forms.useForm<Fields>({
    field: {
      valueType: 'bigint',
      validators: [
        forms.validators.numberWithDot,
        forms.validators.sufficientBalance(balanceRef),
      ],
    },
    percentField: {
      valueType: 'string',
      initialValue: '',
    },
  })

  if (tabRef.current !== tabs.value) {
    form.reset()
    tabRef.current = tabs.value
  }

  const resetFrom = useCallback(() => form.reset(), [])

  useChainChanged(resetFrom)
  useAddressChanged(resetFrom)

  return useMemo(() => ({
    field: form.fields.field,
    percentField: form.fields.percentField,
  }), [
    form,
  ])
}


export default useFields
