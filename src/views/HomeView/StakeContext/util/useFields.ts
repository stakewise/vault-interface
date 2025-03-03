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
  mintTokenBalance: store.account.balances.data.mintTokenBalance,
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

const useFields = (values: Input) => {
  const { tabs } = values

  const { address } = useConfig()
  const { mintTokenBalance, depositTokenBalance } = useStore(storeSelector)

  const isStake = tabs.value === Tab.Stake

  let balance = 0n

  if (address || !isStake) {
    balance = isStake
      ? depositTokenBalance
      : mintTokenBalance
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
