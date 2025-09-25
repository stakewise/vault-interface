import { useMemo } from 'react'
import forms from 'modules/forms'
import { useConfig } from 'config'

import { Options } from './types'
import { Type, Tab } from './enums'


export type Form = {
  tab: Tab
  type: Type
  days: string
}

const useForm = (options: Options) => {
  const { address } = useConfig()

  const userIndex = options.tabs.findIndex(({ id }) => id === Tab.User)
  const otherIndex = options.tabs.findIndex(({ id }) => id !== Tab.User)

  const form = forms.useForm<Form>({
    type: {
      valueType: 'string',
      initialValue: options.types[0].value,
    },
    tab: {
      valueType: 'string',
      initialValue: (options.tabs.length > 1 && userIndex !== -1)
        ? options.tabs[address ? userIndex : otherIndex].id as Tab
        : options.tabs[0].id as Tab,
    },
    days: {
      valueType: 'string',
      initialValue: options.days[0].value,
    },
  })

  const { values } = forms.useFormValues<Form>(form)

  return useMemo(() => ({
    form,
    values,
  }), [
    form,
    values,
  ])
}


export default useForm
