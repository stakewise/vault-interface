import EventAggregator from '../event-aggregator'

import masks from './masks'
import validators from './validators'
import typesParams from './helpers/typesParams'


class Field<V extends Forms.FieldValue> implements Forms.Field<V> {

  #value: V | undefined
  #error: Forms.Field<V>['error']

  readonly #mask?: 'date'
  readonly #initialValue?: V
  readonly #pattern?: string
  readonly #isRequired: boolean
  readonly #events: EventAggregator
  readonly #formRef?: Forms.FieldConfig<V>['formRef']
  readonly #valueType: Forms.FieldConfig<V>['valueType']
  readonly #validators?: Forms.FieldConfig<V>['validators']

  constructor(values: Forms.FieldConfig<V>) {
    let typeParams = {} as Forms.TypeParams
    const getTypeParams = values.type && typesParams[values.type]

    if (typeof getTypeParams === 'function') {
      typeParams = getTypeParams(values.typeInput)
    }

    this.#error = null
    this.#formRef = values.formRef
    this.#valueType = values.valueType
    this.#events = new EventAggregator()
    this.#value = values.initialValue as V
    this.#initialValue = values.initialValue
    this.#mask = values.mask || typeParams?.mask
    this.#pattern = values.pattern || typeParams?.pattern

    this.#validators = [
      ...(typeParams.validators || []), // TODO remove default required validator
      ...(values.validators || []),
    ]

    this.#isRequired = this.#validators.includes(validators.required)
  }

  public validate(value: V | undefined): boolean {
    if (this.#validators?.length) {
      let error

      this.#validators.find((validator) => (
        error = validator(value, this.#formRef?.current?.fields || {})
      ))

      if (error) {
        this.#error = error
        this.#events.dispatch('error', this)

        return false
      }
      else if (this.#error) {
        this.#error = null
        this.#events.dispatch('error', this)
      }
    }

    return true
  }

  public validateWithoutError(): boolean {
    if (this.#validators?.length) {
      let error

      this.#validators.find((validator) => (
        error = validator(this.#value, this.#formRef?.current?.fields || {})
      ))

      return !error
    }

    return true
  }

  public isValidValue(value: V | undefined) {
    if (value === undefined) {
      return true
    }

    if (this.isBigInt) {
      return typeof value === 'bigint'
    }

    if (this.isString) {
      return typeof value === 'string'
    }

    if (this.isBoolean) {
      return typeof value === 'boolean'
    }

    if (this.isNumber) {
      return typeof value === 'number'
    }

    return false
  }

  public setValue(value: V | undefined) {
    let result = value

    const isValidValue = this.isValidValue(value)

    if (!isValidValue) {
      return
    }

    if (result && this.isString) {
      if (this.#mask) {
        const applyMask = masks[this.#mask]

        if (typeof applyMask === 'function') {
          result = applyMask(value as string) as V
        }
      }
      else if (this.#pattern) {
        const isValidPattern = new RegExp(this.#pattern, 'g').test(value as string)

        if (!isValidPattern) {
          return
        }
      }
    }

    this.#value = result
    this.validate(value)
    this.#events.dispatch('change', this)
  }

  public setError(error: Forms.Error) {
    this.#error = error
    this.#events.dispatch('error', this)
  }

  public subscribe(event: Forms.Events, handler: Forms.EventHandler<V>) {
    this.#events.subscribe(event, handler)

    return this
  }

  public unsubscribe(event: Forms.Events, handler: Forms.EventHandler<V>) {
    this.#events.unsubscribe(event, handler)

    return this
  }

  public reset = () => {
    if (this.#value !== this.#initialValue) {
      this.#value = this.#initialValue as V
      this.#events.dispatch('change', this)

      if (this.#error) {
        this.#error = null
        this.#events.dispatch('error', this)
      }
    }
  }

  public get value(): V | undefined {
    return this.#value
  }

  public get error(): Forms.Field<V>['error'] {
    return this.#error
  }

  public get isRequired(): boolean {
    return this.#isRequired
  }

  public get isBigInt(): boolean {
    return this.#valueType === 'bigint'
  }

  public get isString(): boolean {
    return this.#valueType === 'string'
  }

  public get isBoolean(): boolean {
    return this.#valueType === 'boolean'
  }

  public get isNumber(): boolean {
    return this.#valueType === 'number'
  }
}


export default Field
