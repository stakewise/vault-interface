import { RefObject } from 'react'


const _getValues = <F extends Forms.FormValues>(fields: Forms.Form<F>['fields']): Forms.Values<F> => (
  Object.keys(fields).reduce((acc, name) => {
    const value = fields[name].value

    return {
      ...acc,
      [name]: value,
    }
  }, {} as Forms.Values<F> )
)

const _isFormValid = <F extends Forms.FormValues>(fields: Forms.Form<F>['fields']): boolean => {
  let isValid = true

  Object.values(fields).forEach((field) => {
    const valid = field.validate(field.value)

    if (!valid) {
      isValid = false
    }
  })

  return isValid
}

const _hasErrors = <F extends Forms.FormValues>(fields: Forms.Form<F>['fields']): boolean => {
  let hasErrors = false

  Object.values(fields).forEach((field) => {
    const isError = Boolean(field.error)

    if (isError) {
      hasErrors = isError
    }
  })

  return hasErrors
}

const _reset = <F extends Forms.FormValues>(fields: Forms.Form<F>['fields']) => {
  Object.values(fields).forEach((field) => {
    field.reset()
  })
}

const _validateWithoutError = <F extends Forms.FormValues>(fields: Forms.Form<F>['fields']) => (
  Object.values(fields).every((field) => field.validateWithoutError())
)

const createFormMethods = <
  V extends Forms.FieldValue,
  F extends Forms.FormValues = {}
>(fields: Forms.Form<F>['fields'], formRef: RefObject<Forms.Form<F> | null>) => {
  const wrappers = new Map<Forms.FormEventHandler<F>, Forms.EventHandler<V>>()

  const subscribe = (event: Forms.Events, handler: Forms.FormEventHandler<F>) => {
    const wrapper: Forms.EventHandler<V> = () => {
      if (formRef.current) {
        handler(formRef.current)
      }
    }

    wrappers.set(handler, wrapper)

    Object.values(fields).forEach((field) => {
      field.subscribe(event, wrapper)
    })
  }

  const unsubscribe = (event: Forms.Events, handler: Forms.FormEventHandler<F>) => {
    const wrapper = wrappers.get(handler)

    if (!wrapper) {
      return
    }

    Object.values(fields).forEach((field) => {
      field.unsubscribe(event, wrapper)
    })

    wrappers.delete(handler)
  }

  return {
    subscribe,
    unsubscribe,
    reset: () => _reset(fields),
    getValues: () => _getValues(fields),
    hasErrors: () => _hasErrors(fields),
    isFormValid: () => _isFormValid(fields),
    validateWithoutError: () => _validateWithoutError(fields),
  }
}


export default createFormMethods
