import React from 'react'
import DropdownView from '../../Dropdown/DropdownView/DropdownView'

import Option, { OptionType } from '../Option/Option'


export type DropdownPlainOption = OptionType & {
  value: string
}

export type DropdownOption = DropdownPlainOption & {
  options?: DropdownPlainOption[]
  onChange?: (value: DropdownPlainOption['value']) => void
}

type OptionListProps = {
  dataTestId?: string
  options: DropdownOption[]
  activeOption: number | null
  setParentOptionValue: (value: string | null) => void
}

const OptionList: React.FC<OptionListProps> = (props) => {
  const { options, dataTestId, activeOption, setParentOptionValue } = props

  return (
    <>
      {
        options.map((option, index) => {
          const { title, subTitle, value, logo, icon } = option

          const isParentOption = Boolean(option.options?.length)
          const isSelected = activeOption === index

          return isParentOption ? (
            <div
              key={index}
              role="option"
              tabIndex={-1}
              aria-selected={isSelected}
            >
              <Option
                key={index}
                title={title}
                subTitle={subTitle}
                logo={logo}
                icon={icon}
                active={isSelected}
                withArrow
                dataTestId={`${option.dataTestId}-button`}
                onClick={() => setParentOptionValue(option.value)}
              />
            </div>
          ) : (
            <DropdownView.Option
              key={index}
              as="div"
              value={value}
              onClick={() => setParentOptionValue(null)}
            >
              {
                ({ active, selected }) => (
                  <Option
                    title={title}
                    subTitle={subTitle}
                    logo={logo}
                    icon={icon}
                    active={active || selected}
                    dataTestId={`${dataTestId}-option-${value.toLowerCase()}`}
                  />
                )
              }
            </DropdownView.Option>
          )
        })
      }
    </>
  )
}


export default React.memo(OptionList)
