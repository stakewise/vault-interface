import { useRef, useEffect, useMemo } from 'react'
import forms from 'sw-modules/forms'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { Tab } from './enum'
import emptyBalance from './emptyBalance'


type Input = {
  data: StakePage.Data
  tabs: StakePage.Tabs.Data
}

type Fields = {
  field: bigint
  percentField: string
}

const storeSelector = (store: Store) => ({
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

const useFields = (values: Input) => {
  const { data, tabs } = values

  const { depositTokenBalance } = useStore(storeSelector)
  const { address, isChainChanged, isAddressChanged } = useConfig()

  const isStake = tabs.value === Tab.Stake

  let balance = 0n

  if (address || !isStake) {
    balance = isStake
      ? depositTokenBalance
      : data.mintTokenBalance
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

  useEffect(() => {
    if (isChainChanged || isAddressChanged) {
      form.reset()
    }
  }, [ form, isChainChanged, isAddressChanged ])

  return useMemo(() => ({
    field: form.fields.field,
    percentField: form.fields.percentField,
  }), [
    form,
  ])
}


export default useFields
