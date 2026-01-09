import { useRef, RefObject } from 'react'
import { parseEther } from 'ethers'
import { useConfig } from 'config'
import forms from 'modules/forms'
import { useStore } from 'hooks'

import swapHooks from '../../../swap'

import messages from './messages'


type Input = {
  swapFee: bigint
  swapTokens: ReturnType<typeof swapHooks.useTokens>
  getSwappedDepositAmount: ReturnType<typeof swapHooks.useFee>['getSwappedDepositAmount']
}

type CheckCapacityInput = RefObject<{
  capacity: string
  totalAssets: string
  depositToken: string
  getSwappedDepositAmount: ReturnType<typeof swapHooks.useFee>['getSwappedDepositAmount']
}>

const checkCapacity = (dataRef: CheckCapacityInput) => (value?: Forms.FieldValue) => {
  const { capacity, totalAssets, depositToken, getSwappedDepositAmount } = dataRef.current

  if (Number(value) && Number(capacity)) {
    const valueBI = BigInt(value as string)

    const amount = getSwappedDepositAmount(valueBI)
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
})

const useStakeField = (values: Input) => {
  const { swapTokens, swapFee, getSwappedDepositAmount } = values

  const { sdk, address } = useConfig()
  const { capacity, totalAssets } = useStore(storeSelector)

  const depositToken = sdk.config.tokens.depositToken
  const maxBalance = address ? swapTokens.sellToken.balance : swapTokens.sellToken.emptyBalance
  const minBalance = swapFee / 100n * 120n

  const balanceRef = useRef(maxBalance)
  balanceRef.current = maxBalance

  const minBalanceRef = useRef(minBalance)
  minBalanceRef.current = minBalance

  const capacityDataRef = useRef({ capacity, totalAssets, depositToken, getSwappedDepositAmount })
  capacityDataRef.current = { capacity, totalAssets, depositToken, getSwappedDepositAmount }

  const field = forms.useField<bigint>({
    valueType: 'bigint',
    validators: [
      checkCapacity(capacityDataRef),
      checkMinBalance(minBalanceRef),
      forms.validators.numberWithDot,
      forms.validators.sufficientBalance(balanceRef),
    ],
  })

  return field
}


export default useStakeField
