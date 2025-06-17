import { useRef, useMemo, RefObject, useEffect } from 'react'
import { useConfig } from 'config'
import forms from 'modules/forms'
import { parseEther } from 'ethers'

import useStore from '../data/useStore'

import messages from './messages'


type Input = {
  minBalance: bigint
  maxBalance: bigint
  getDepositAmount?: (value: bigint) => bigint
  withCapacityCheck?: boolean
}

type CheckCapacityInput = RefObject<{
  capacity: string
  totalAssets: string
  depositToken: string
  withCapacityCheck?: boolean
  getDepositAmount?: Input['getDepositAmount']
}>

const checkCapacity = (dataRef: CheckCapacityInput) => (value?: Forms.FieldValue) => {
  const { capacity, totalAssets, depositToken, withCapacityCheck, getDepositAmount } = dataRef.current

  if (Number(value) && Number(capacity) && withCapacityCheck) {
    const valueBI = BigInt(value as string)
    const amount = typeof getDepositAmount === 'function' ? getDepositAmount(valueBI) : valueBI
    const capacityBI = parseEther(capacity)
    const totalAssetsBI = parseEther(totalAssets)
    const newCapacity = amount + totalAssetsBI

    if (capacityBI < newCapacity) {
      return {
        ...messages.capacityError,
        values: { token: depositToken },
      }
    }
  }
}

const checkMinBalance = (minBalanceRef: RefObject<bigint>) => (value?: Forms.FieldValue) => {
  const minBalance = minBalanceRef.current

  if (value && minBalance) {
    if ((value as bigint) < minBalance) {
      return messages.feeError
    }
  }
}

const storeSelector = (store: Store) => ({
  capacity: store.vault.base.data.capacity,
  totalAssets: store.vault.base.data.totalAssets,
  isWhitelisted: store.vault.user.roles.data.isWhitelisted,
})

const useStakeField = ({ minBalance, maxBalance, withCapacityCheck, getDepositAmount }: Input) => {
  const { sdk } = useConfig()

  const { capacity, totalAssets, isWhitelisted } = useStore(storeSelector)

  const balanceRef = useRef(maxBalance)
  balanceRef.current = maxBalance

  const minBalanceRef = useRef(minBalance)
  minBalanceRef.current = minBalance

  const depositToken = sdk.config.tokens.depositToken
  const capacityDataRef = useRef({ capacity, totalAssets, depositToken, withCapacityCheck, getDepositAmount })
  capacityDataRef.current = { capacity, totalAssets, depositToken, withCapacityCheck, getDepositAmount }

  const field = forms.useField<bigint>({
    valueType: 'bigint',
    validators: [
      checkCapacity(capacityDataRef),
      checkMinBalance(minBalanceRef),
      forms.validators.numberWithDot,
      forms.validators.sufficientBalance(balanceRef),
    ],
  })

  const { value, error } = forms.useFieldValue(field)

  const isDisabled = Boolean(error) || !value || !isWhitelisted

  useEffect(() => {
    if (field.value) {
      field.validate(field.value)
    }
  }, [ field, capacity, totalAssets, depositToken, minBalance, maxBalance ])

  return useMemo(() => ({
    field,
    value,
    error,
    isDisabled,
  }), [
    field,
    value,
    error,
    isDisabled,
  ])
}


export default useStakeField
