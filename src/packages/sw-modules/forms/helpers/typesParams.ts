import validators from '../validators'


const getTokenAmountParams = (values: Forms.GetTypesInput = {}): Forms.TypeParams => {
  const { balanceRef, isRequired = true } = values

  const params = {
    validators: [
      validators.numberWithDot,
      validators.greaterThanZero,
    ],
    pattern: '^[0-9]+[.]?[0-9]{0,18}$',
  }

  if (isRequired) {
    params.validators = [
      validators.required,
      ...params.validators,
    ]
  }

  if (balanceRef?.current) {
    params.validators = [
      ...params.validators,
      validators.sufficientBalance(balanceRef),
    ]
  }

  return params
}

const getDateParams = (values: Forms.GetTypesInput = {}): Forms.TypeParams => {
  const { isRequired = true } = values

  const params = {
    validators: [
      validators.validDate,
    ],
    mask: 'date' as 'date',
  }

  if (isRequired) {
    params.validators = [
      validators.required,
      ...params.validators,
    ]
  }

  return params
}

const getAddressParams = (values: Forms.GetTypesInput = {}): Forms.TypeParams => {
  const { isRequired = true, isEns = true } = values

  const baseValidator = isEns ? validators.ethOrEnsAddress : validators.ethAddress

  const params = {
    validators: [
      baseValidator,
    ],
  }

  if (isRequired) {
    params.validators = [
      validators.required,
      ...params.validators,
    ]
  }

  return params
}

const getNumberParams = (values: Forms.GetTypesInput = {}): Forms.TypeParams => {
  const { isRequired = true, min, max } = values

  const params: Forms.TypeParams = {
    validators: [
      validators.number,
    ],
    pattern: '^\\d+$',
  }

  if (isRequired) {
    params.validators = [
      validators.required,
      ...params.validators,
    ]
  }

  if (min) {
    params.validators = [
      validators.min(min),
      ...params.validators,
    ]
  }

  if (max) {
    params.validators = [
      validators.max(max),
      ...params.validators,
    ]
  }

  return params
}

const typesParams: Record<string, (params: any) => Forms.TypeParams> = {
  tokenAmount: getTokenAmountParams,
  address: getAddressParams,
  number: getNumberParams,
  date: getDateParams,
}


export default typesParams
