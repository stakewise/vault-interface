import { useRef } from 'react'
import forms from 'modules/forms'
import { parseEther } from 'ethers'


const minBoost = parseEther('0.05')

const useBoostField = (balance: bigint) => {
  const balanceRef = useRef(balance)
  balanceRef.current = balance

  return forms.useField<bigint>({
    valueType: 'bigint',
    validators: [
      forms.validators.numberWithDot,
      forms.validators.min(minBoost),
      forms.validators.sufficientBalance(balanceRef),
    ],
  })
}


export default useBoostField
