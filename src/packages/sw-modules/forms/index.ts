import { RefObject } from 'react'


declare global {

  namespace Forms {

    interface Field<V extends FieldValue> {
      value: V | undefined

      isNumber: boolean

      isBigInt: boolean

      isString: boolean

      isBoolean: boolean

      isRequired: boolean

      error: null | Intl.Message | string

      reset(): void

      validate(value: V): boolean

      setError(error: Error): void

      validateWithoutError(): boolean

      setValue(value: V | undefined): void

      isValidValue(value: V | undefined): boolean

      subscribe(event: Events, handler: EventHandler<V>): Field<V>

      unsubscribe(event: Events, handler: EventHandler<V>): Field<V>
    }

    interface Form<F extends FormValues> {
      fields: {
        [K in keyof F]: Field<F[K]>
      }

      reset: () => void

      hasErrors: () => boolean

      isFormValid: () => boolean

      validateWithoutError: () => boolean

      subscribe: (event: Events, handler: EventHandler<FieldValue>) => void

      unsubscribe: (event: Events, handler: EventHandler<FieldValue>) => void

      getValues: () => {
        [K in keyof F]: Field<F[K]>['value']
      }
    }

    type FieldConfig<V = FieldValue> = {
      mask?: 'date'
      initialValue?: V
      pattern?: string
      typeInput?: GetTypesInput
      validators?: Validator<FormValues>[]
      type?: 'tokenAmount' | 'date' | 'address' | 'number'
      valueType: 'bigint' | 'string' | 'number' | 'boolean'
      formRef?: RefObject<Form<FormValues>> | null
    }

    type TypeParams = {
      mask?:  FieldConfig['mask']
      pattern?: FieldConfig['pattern']
      validators: Validator<FormValues>[]
    }

    type GetTypesInput = {
      balanceRef?: RefObject<bigint>
      isRequired?: boolean
      isEns?: boolean
      min?: number
      max?: number
    }

    type FieldsConfig<F extends FormValues> = {
      [K in keyof F]: FieldConfig<F[K]>
    }

    type Values<F extends FormValues> = {
      [K in keyof F]: Field<F[K]>['value'] | undefined
    }

    type Events = 'change' | 'error'

    type Error = Intl.Message | string | null

    type FormValues = Record<string, FieldValue>

    type FieldValue = string | number | boolean | bigint

    type EventHandler<V extends FieldValue> = (field: Field<V>) => void

    type Validator<F extends FormValues> = (value: FieldValue | undefined, form: Form<F>['fields']) => Intl.Message | undefined
  }
}

import useFieldValidate from './useFieldValidate'
import useFormValidate from './useFormValidate'
import useFieldFilled from './useFieldFilled'
import useFieldValue from './useFieldValue'
import useFormValues from './useFormValues'
import useFormFilled from './useFormFilled'
import validators from './validators'
import useField from './useField'
import useForm from './useForm'
import Field from './Field'


export default {
  useFieldValidate,
  useFormValidate,
  useFieldFilled,
  useFieldValue,
  useFormValues,
  useFormFilled,
  validators,
  useField,
  useForm,
  Field,
}
