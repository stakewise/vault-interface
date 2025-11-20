import { useMemo } from 'react'
import forms from 'modules/forms'

import vaultHooks from '../../index'

import useUnboostSubmit from './useUnboostSubmit'
import useUnboostDisabled from './useUnboostDisabled'
import useUnboostTransactionPrice from './useUnboostTransactionPrice'


type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const useUnboost = (values: Input) => {
  const { fetchAllUserData } = values

  const percentField = forms.useField<string>({
    valueType: 'string',
    initialValue: '',
  })

  const transactionPrice = useUnboostTransactionPrice()

  const { submit, isSubmitting } = useUnboostSubmit({
    percentField,
    fetchAllUserData,
  })

  const { unboostTooltip, isUnboostDisabled } = useUnboostDisabled()

  return useMemo(() => ({
    percentField,
    unboostTooltip,
    transactionPrice,
    isUnboostDisabled,
    isUnboostLoading: isSubmitting,
    submit,
  }), [
    percentField,
    isSubmitting,
    unboostTooltip,
    transactionPrice,
    isUnboostDisabled,
    submit,
  ])
}

useUnboost.mock = {
  transactionPrice: 0n,
  isUnboostLoading: false,
  isUnboostDisabled: false,
  percentField: {} as Forms.Field<string>,
  submit: () => {},
} as ReturnType<typeof useUnboost>


export default useUnboost
