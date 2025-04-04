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

const _subscribe = <V extends Forms.FieldValue, F extends Forms.FormValues = {}>(values: {
  handler: Forms.EventHandler<V>
  fields: Forms.Form<F>['fields']
  event: Forms.Events
}) => {
  const { fields, event, handler } = values

  Object.values(fields).forEach((field) => {
    field.subscribe(event, handler)
  })
}

const _unsubscribe = <V extends Forms.FieldValue, F extends Forms.FormValues = {}>(values: {
  handler: Forms.EventHandler<V>
  fields: Forms.Form<F>['fields']
  event: Forms.Events
}) => {
  const { fields, event, handler } = values

  Object.values(fields).forEach((field) => {
    field.unsubscribe(event, handler)
  })
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
>(fields: Forms.Form<F>['fields']) => ({
  reset: () => _reset(fields),
  getValues: () => _getValues(fields),
  hasErrors: () => _hasErrors(fields),
  isFormValid: () => _isFormValid(fields),
  validateWithoutError: () => _validateWithoutError(fields),
  subscribe: (event: Forms.Events, handler: Forms.EventHandler<V>) => _subscribe({ fields, event, handler }),
  unsubscribe: (event: Forms.Events, handler: Forms.EventHandler<V>) => _unsubscribe({ fields, event, handler }),
})


export default createFormMethods
