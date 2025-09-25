import { useRef } from 'react'
import forms from 'modules/forms'
import { useConfig } from 'config'
import { constants } from 'helpers'


const useUnstakeField = (balance: bigint) => {
  const { address } = useConfig()

  const maxShares = address ? balance : constants.blockchain.emptyBalance

  const balanceRef = useRef(maxShares)
  balanceRef.current = maxShares

  return forms.useField<bigint>({
    valueType: 'bigint',
    validators: [
      forms.validators.numberWithDot,
      forms.validators.sufficientBalance(balanceRef),
    ],
  })
}


export default useUnstakeField
