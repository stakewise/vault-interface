import React, { useMemo, useState } from 'react'

import DropdownView, { DropdownViewProps } from '../Dropdown/DropdownView/DropdownView'

import BackButton from './BackButton/BackButton'
import OptionList, { DropdownOption } from './OptionList/OptionList'

import { useKeyboardEvents } from './util'


export type MenuDropdownProps = Omit<DropdownViewProps, 'children'> & {
  className?: string
  dataTestId?: string
  options: DropdownOption[]
  onChange?: (value: DropdownOption['value']) => void
}

const MenuDropdown: React.FC<MenuDropdownProps> = (props) => {
  const { className, dataTestId, options, onChange, ...rest } = props

  const [ parentOptionValue, setParentOptionValue ] = useState<string | null>(null)

  const parentOption = useMemo(() => {
    if (parentOptionValue) {
      return options.find(({ value }) => value === parentOptionValue) || null
    }

    return null
  }, [ options, parentOptionValue ])

  const { activeOption, handleClick, handleKeyDown } = useKeyboardEvents({
    options,
    parentOption,
    setParentOptionValue,
  })

  return (
    <DropdownView
      className={className}
      {...rest}
      dataTestId={dataTestId || parentOption?.dataTestId}
      value={parentOption?.value || ''}
      onClose={() => setParentOptionValue(null)}
      onChange={parentOption?.onChange || onChange}
      onOptionsClick={handleClick}
      onOptionsKeyDown={handleKeyDown}
    >
      <div className="py-8">
        {
          Boolean(parentOption) && (
            <BackButton
              className="mb-8"
              title={parentOption?.title}
              onClick={() => setParentOptionValue(null)}
            />
          )
        }
        <OptionList
          key={parentOption?.value}
          dataTestId={dataTestId || parentOption?.dataTestId}
          options={parentOption?.options || options}
          activeOption={activeOption}
          setParentOptionValue={setParentOptionValue}
        />
      </div>
    </DropdownView>
  )
}


export default React.memo(MenuDropdown)
