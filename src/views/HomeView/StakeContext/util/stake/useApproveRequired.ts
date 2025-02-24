import { useCallback, useState } from 'react'
import { useFieldListener } from 'hooks'


type Input = {
  amountField: Forms.Field<bigint>
  allowance: bigint
  skip?: boolean
}

const useApproveRequired = ({ amountField, allowance, skip }: Input) => {
  const [ isApproveRequired, setApproveRequired ] = useState((amountField.value || 0n) > allowance)

  const handleChange = useCallback((amountField: Forms.Field<bigint>) => {
    const amount = amountField.value || 0n

    setApproveRequired(amount > allowance)
  }, [ allowance, setApproveRequired ])

  useFieldListener(amountField, handleChange)

  return !skip && isApproveRequired
}


export default useApproveRequired
