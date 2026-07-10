import { RefObject } from 'react'
import { parseEther, isAddress, formatEther } from 'ethers'

import date from '../../date'

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
  if (typeof value === 'string' && value && !isAddress(value) && !ensAddressRegex.test(value)) {
    return messages.ethOrEnsAddress
  }
}

const email = (value: Value) => {
  if (typeof value === 'string' && !emailRegex.test(value)) {
    return messages.email
  }
}

const httpsUrl = (value: Value) => {
  if (typeof value !== 'string' || !value) {
    return
  }

  try {
    const parsed = new URL(value.trim())

    if (parsed.protocol !== 'https:' || !parsed.hostname) {
      return messages.httpsUrl
    }
  }
  catch {
    return messages.httpsUrl
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

const minFee = (minFeeRef: RefObject<bigint>) => (value?: Forms.FieldValue) => {
  const minFeeValue = minFeeRef.current

  if (value && minFeeValue) {
    if ((value as bigint) < minFeeValue) {
      return messages.feeError
    }
  }
}

const min = (minValue: number | bigint, customMessage?: Intl.Message) => (value: Value) => {
  const formattedMinValue = typeof minValue === 'bigint' ? Number(formatEther(minValue)) : minValue
  const formattedValue = typeof value === 'bigint' ? Number(formatEther(value)) : Number(value)

  if (formattedValue < formattedMinValue) {
    const message = customMessage || messages.min

    const error: Intl.Message = {
      ...message,
      values: {
        ...customMessage?.values,
        minValue: formattedMinValue,
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
  if (typeof value === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return messages.invalidDate
  }
}

const selected = (value: Value) => {
  if (!value) {
    return messages.selected
  }
}

const maxLength = (maxLength: number) => (value: Value) => {
  if (typeof value === 'string' && value?.length > maxLength) {
    return { ...messages.maxLength, values: { maxLength } }
  }
}

const minLength = (minLength: number) => (value: Value) => {
  if (typeof value === 'string' && value.length > 0 && value.length < minLength) {
    return { ...messages.minLength, values: { minLength } }
  }
}

const minDate = (minDate: string) => (value: Value) => {
  if (value && typeof value === 'string') {
    const minimalDate = date.time(minDate).startOf('day')
    const isMinDate = date.time(value).isBefore(minimalDate)

    if (isMinDate) {
      return { ...messages.minDate, values: { minDate: minimalDate.format('YYYY-MM-DD') } }
    }
  }
}

const maxDate = (maxDate: string) => (value: Value) => {
  if (value && typeof value === 'string') {
    const maximalDate = date.time(maxDate).endOf('day')
    const isMaxDate = date.time(value).isAfter(maximalDate)

    if (isMaxDate) {
      return { ...messages.maxDate, values: { maxDate: maximalDate.format('YYYY-MM-DD') } }
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
      const valueDate = date.time(value)
      const compareDate = date.time(valueToCompare)
      const compareMore = Boolean(moreThan)

      const isError = compareMore
        ? !valueDate.isAfter(compareDate)
        : !valueDate.isBefore(compareDate)

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
  maxLength,
  minLength,
  httpsUrl,
  selected,
  required,
  exclude,
  maxDate,
  minDate,
  number,
  minFee,
  email,
  min,
  max,
}
