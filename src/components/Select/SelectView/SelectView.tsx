import React, { useMemo } from 'react'
import { methods } from 'helpers'

import Dropdown, { DropdownProps } from '../../Dropdown/Dropdown'

import SelectButton from '../SelectButton/SelectButton'
import SelectWithLabelButton from '../SelectWithLabelButton/SelectWithLabelButton'


type DropdownOption = DropdownProps['options'][number]

export type SelectViewProps = {
  className?: string
  value: string
  placement?: DropdownProps['placement']
  dataTestId?: string
  isError?: boolean
  disabled?: boolean
  label?: Intl.Message | string
  options: DropdownOption[]
  onChange: (value: string) => void
}

const SelectView: React.FC<SelectViewProps> = (props) => {
  const {
    className, value, label, options, placement, dataTestId = 'select', isError, disabled,
    onChange, ...otherProps
  } = props

  const htmlAttrs = methods.getGlobalHtmlAttrs(otherProps)

  const selectedOption = useMemo<DropdownOption | undefined>(() => (
    options.find((optionData) => optionData.value === value)
  ), [ options, value ])

  return (
    <Dropdown
      className={className}
      placement={placement}
      options={options}
      value={value}
      disabled={disabled}
      withArrow
      dataTestId={dataTestId}
      button={({ isOpen }) => label ? (
        <SelectWithLabelButton
          className="w-full"
          label={label}
          fullWidth
          disabled={disabled}
          isError={isError}
          title={selectedOption?.title}
          dataTestId={`${dataTestId}-button`}
          icon={isOpen ? 'arrow/up' : 'arrow/down'}
          {...htmlAttrs}
        />
      ) : (
        <SelectButton
          className="w-full"
          fullWidth
          disabled={disabled}
          isError={isError}
          logo={selectedOption?.logo}
          title={selectedOption?.title}
          dataTestId={`${dataTestId}-button`}
          icon={isOpen ? 'arrow/up' : 'arrow/down'}
          {...htmlAttrs}
        />
      )}
      onChange={onChange as DropdownProps['onChange']}
    />
  )
}


export default React.memo(SelectView)
