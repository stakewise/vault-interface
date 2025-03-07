import React from 'react'
import methods from 'sw-methods'

import Text from '../Text/Text'
import FieldValue from '../FieldValue/FieldValue'

import SelectView, { SelectViewProps } from './SelectView/SelectView'


export type SelectProps = Omit<SelectViewProps, 'value' | 'onChange'> & {
  field?: Forms.Field<string>
  value?: SelectViewProps['value']
  onChange?: SelectViewProps['onChange']
}

const Select: React.FC<SelectProps> = (props) => {
  const {
    className, field, value, label, options, placement, dataTestId = 'select',
    isError, onChange,
    ...otherProps
  } = props

  const htmlAttrs = methods.getGlobalHtmlAttrs(otherProps)

  if (field && !field.isString) {
    throw new Error('Select should work with string field')
  }

  if (field) {
    return (
      <FieldValue field={field}>
        {
          ({ value, error }) => {
            const isErrored = Boolean(isError || error)
            const isRequired = field.isRequired

            return (
              <>
                <SelectView
                  className={className}
                  label={label}
                  options={options}
                  isError={isErrored}
                  value={String(value)}
                  placement={placement}
                  dataTestId={dataTestId}
                  aria-invalid={isErrored}
                  aria-required={isRequired}
                  onChange={(value) => field.setValue(value)}
                  {...htmlAttrs}
                />
                {
                  isErrored && (
                    <Text
                      className="w-full absolute left-0 pt-2 px-16 opacity-70"
                      message={error as string}
                      size="t14"
                      color="error"
                      dataTestId={`${dataTestId}Error`}
                    />
                  )
                }
              </>
            )
          }
        }
      </FieldValue>
    )
  }

  return (
    <SelectView
      className={className}
      label={label}
      options={options}
      isError={isError}
      placement={placement}
      dataTestId={dataTestId}
      value={value as SelectViewProps['value']}
      onChange={onChange as SelectViewProps['onChange']}
      {...htmlAttrs}
    />
  )
}


export default React.memo(Select)
