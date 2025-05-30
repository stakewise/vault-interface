import { useCallback, useMemo, useState } from 'react'
import { formatUnits, parseUnits } from 'ethers'
import forms from 'modules/forms'


type Input = {
  field: Forms.Field<string | bigint>
  units: number
}

const useSpecialFormat = ({ field, units }: Input) => {
  const { value } = forms.useFieldValue(field)
  const [ inputValueInString, setInputValueInString ] = useState<string>('')
  const [ specialFormat, setSpecialFormat ] = useState<string | null>(null)

  const handleChange = useCallback((value: string) => {
    if (!value) {
      setInputValueInString('')
      field.setValue(undefined)

      return
    }

    if (field.isBigInt) {
      const isValid = /^[0-9]+[.]?[0-9]{0,18}$/.test(value)

      if (!isValid) {
        return
      }

      setInputValueInString(value)

      if (value[value.length - 1] === '.') {
        setSpecialFormat('.')
      }
      else if (/\.0*$/g.test(value)) {
        setSpecialFormat(`.${value.replace(/^.*\./g, '')}`)
      }
      else {
        setSpecialFormat(null)
      }

      const result = parseUnits(value, units)

      field.setValue(result)
    }
    else {
      field.setValue(value)
    }
  }, [ field, units ])

  if (!field.isString && !field.isBigInt) {
    throw new Error('TokenAmountInput should work with bigint or string field')
  }

  const formattedValue = useMemo<string | undefined>(() => {
    if (value === undefined) {
      return value
    }

    if (field.isBigInt) {
      const result = formatUnits(value as bigint, units).replace(/\.0+$/, '')
      const formattedValue = specialFormat ? `${result}${specialFormat}` : result

      const remainder = inputValueInString.replace(formattedValue, '')
      const isRemainderZero = /^0+$/.test(remainder)

      return isRemainderZero ? `${formattedValue}${remainder}` : formattedValue
    }

    return value as string
  }, [ value, units, specialFormat, inputValueInString ])

  return useMemo(() => ({
    formattedValue,
    handleChange,
    setSpecialFormat,
  }), [
    formattedValue,
    handleChange,
    setSpecialFormat,
  ])
}


export default useSpecialFormat
