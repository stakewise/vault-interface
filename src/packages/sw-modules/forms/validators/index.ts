import { RefObject } from 'react'
import { parseEther, isAddress, formatEther } from 'ethers'

import messages from './messages'


// ATTN if you add new validator, then add unit test for it!

type Value = Forms.FieldValue | undefined

// Regular expressions
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
const ensAddressRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/

// Helpers
const isEmpty = (value: any): boolean => (
  typeof value === 'undefined'
  || value === null
  || value === ''
  || /^\s+$/.test(value)
)

const formatValue = (value: Value) => {
  if (typeof value === 'bigint') {
    return formatEther(value)
  }

  return value
}

const hasSufficientBalance = (balance: RefObject<bigint>, value: Value): boolean => {
  const isValidBalance = typeof balance.current === 'bigint'
  const isValidValue = (typeof value === 'string' || typeof value === 'bigint') && !isEmpty(value)

  if (isValidBalance && isValidValue) {
    try {
      if (typeof value === 'bigint') {
        return balance.current >= value
      }

      return balance.current >= parseEther(value)
    }
    catch (error) {
      console.error(error)
      return false
    }
  }

  return false
}

const isValidNumberWithDot = (value: Value) => {
  const formattedValue = formatValue(value)

  return (
    isEmpty(formattedValue) ? true : !isNaN(Number(formattedValue))
  )
}

// Validators
const required = (value: Value) => {
  if (isEmpty(value)) {
    return messages.required
  }
}

const ethAddress = (value: Value) => {
  if (typeof value === 'string' && !isAddress(value)) {
    return messages.ethAddress
  }
}

const ethOrEnsAddress = (value: Value) => {
  if (typeof value === 'string' && !isAddress(value) && !ensAddressRegex.test(value)) {
    return messages.ethOrEnsAddress
  }
}

const email = (value: Value) => {
  if (typeof value === 'string' && !emailRegex.test(value)) {
    return messages.email
  }
}

const numberWithDot = (value: Value) => {
  if (!isValidNumberWithDot(value)) {
    return messages.invalidNumberWithDot
  }
}

const sufficientBalance = (balance: RefObject<bigint>) => (value: Value) => {
  if (value && !hasSufficientBalance(balance, value)) {
    return messages.insufficientBalance
  }
}

const exclude = (values: string[]) => (value: Value) => {
  if (typeof value === 'string' && values.includes(value)) {
    return messages.exclude
  }
}

const greaterThanZero = (value: Value) => {
  const isValidValue = (typeof value === 'string' || typeof value === 'bigint') && !isEmpty(value)

  if (isValidValue && Number(value) <= 0) {
    return messages.greaterThanZero
  }
}

const min = (minValue: number | bigint, customMessage?: Intl.Message) => (value: Value) => {
  if (Number(value) < minValue) {
    const message = customMessage || messages.min

    const error: Intl.Message = {
      ...message,
      values: {
        ...customMessage?.values,
        minValue: Number(minValue),
      },
    }

    return error
  }
}

const max = (maxValue: number | bigint, customMessage?: Intl.Message) => (value: Value) => {
  if (Number(value) > maxValue) {
    const message = customMessage || messages.max

    return {
      ...message,
      values: {
        ...customMessage?.values,
        maxValue: Number(maxValue),
      },
    }
  }
}

const number = (value: Value) => {
  if (typeof value === 'string' && value && isNaN(Number(value))) {
    return messages.number
  }
}

const validDate = (value: Value) => {
  if (typeof value === 'string' && !/^\d\d\d\d-\d\d-\d\d$/.test(value)) {
    return messages.invalidDate
  }
}

const selected = (value: Value) => {
  if (!value) {
    return messages.selected
  }
}

const length = (length: number) => (value: Value) => {
  if (typeof value === 'string' && value?.length > length) {
    return { ...messages.length, values: { length } }
  }
}

const minDate = (minDate: string) => (value: Value) => {
  if (value && typeof value === 'string') {

    const dateToCompare = new Date(minDate)
    const date = new Date(value)

    if (date < dateToCompare) {
      return { ...messages.minDate, values: { minDate } }
    }
  }
}

const maxDate = (maxDate: string) => (value: Value) => {
  if (value && typeof value === 'string') {

    const dateToCompare = new Date(maxDate)
    const date = new Date(value)

    if (date > dateToCompare) {
      return { ...messages.maxDate, values: { maxDate } }
    }
  }
}

type FormFields = Record<string, Forms.Field<string | number | boolean | bigint>>

type CompareDateProps = {
  moreThan?: string
  lessThan?: string
}

const compareDate = ({ moreThan, lessThan }: CompareDateProps) => (value: Value, fields: FormFields) => {
  if (value && typeof value === 'string') {
    const fieldName = moreThan || lessThan
    const valueToCompare = fields[fieldName as string]?.value

    if (value && valueToCompare && typeof valueToCompare === 'string') {
      const date = new Date(value)
      const compareDate = new Date(valueToCompare)
      const compareMore = Boolean(moreThan)

      const isError = compareMore
        ? date <= compareDate
        : date >= compareDate

      if (isError) {
        const errorMessage = compareMore ? messages.mustBeMore : messages.mustBeLess

        return { ...errorMessage, values: { valueToCompare } }
      }
    }
  }
}

export default {
  sufficientBalance,
  ethOrEnsAddress,
  greaterThanZero,
  numberWithDot,
  compareDate,
  ethAddress,
  validDate,
  selected,
  required,
  exclude,
  maxDate,
  minDate,
  length,
  number,
  email,
  min,
  max,
}
