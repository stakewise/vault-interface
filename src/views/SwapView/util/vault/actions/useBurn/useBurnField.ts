import { useRef } from 'react'
import forms from 'modules/forms'


const useBurnField = (balance: bigint) => {
  const balanceRef = useRef(balance)
  balanceRef.current = balance

  return forms.useField<bigint>({
    valueType: 'bigint',
    validators: [
      forms.validators.numberWithDot,
      forms.validators.sufficientBalance(balanceRef),
    ],
  })
}


export default useBurnField
