import { useEffect } from 'react'
import { modifiers } from 'helpers'
import forms from 'sw-modules/forms'
import date from 'sw-modules/date'

import messages from './messages'


type FileFormat = 'xlsx' | 'csv'

export type ExportForm = {
  to: string
  from: string
  format: FileFormat
}

type FormatOption = {
  title: Intl.Message
  value: FileFormat
}

export const formatOptions: FormatOption[] = [
  {
    title: messages.format.xlsx,
    value: 'xlsx',
  },
  {
    title: messages.format.csv,
    value: 'csv',
  },
]

const projectLaunchDate = '2023-11-28'

const useForm = () => {
  const toDate = date.time().subtract(1, 'day')
  const fromDate = toDate.subtract(30, 'day')
  const formattedToDate = modifiers.formatDateToNumerical(toDate)

  const form = forms.useForm<ExportForm>({
    from: {
      type: 'date',
      valueType: 'string',
      initialValue: modifiers.formatDateToNumerical(fromDate),
      validators: [
        forms.validators.required,
        forms.validators.validDate,
        forms.validators.minDate(projectLaunchDate),
        forms.validators.compareDate({ lessThan: 'to' }),
      ],
    },
    to: {
      type: 'date',
      valueType: 'string',
      initialValue: formattedToDate,
      validators: [
        forms.validators.required,
        forms.validators.validDate,
        forms.validators.minDate(projectLaunchDate),
        forms.validators.maxDate(formattedToDate),
        forms.validators.compareDate({ moreThan: 'from' }),
      ],
    },
    format: {
      valueType: 'string',
      initialValue: formatOptions[0].value,
      validators: [
        forms.validators.required,
        forms.validators.selected,
      ],
    },
  })

  useEffect(() => {
    const resetError = () => {
      const isFormValid = form.isFormValid()

      if (isFormValid) {
        form.fields.format.setError(null)
        form.fields.to.setError(null)
      }
    }

    form.subscribe('change', resetError)

    return () => {
      form.unsubscribe('change', resetError)
    }
  },  [ form ])

  return form
}


export default useForm
