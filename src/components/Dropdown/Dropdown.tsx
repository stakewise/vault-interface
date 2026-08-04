import React from 'react'
import { ListboxOption } from '@headlessui/react'

import { TextSize } from '../Text/Text'
import { IconName, LogoName } from '../Image/Image'
import DropdownView from './DropdownView/DropdownView'
import type { DropdownViewProps } from './DropdownView/DropdownView'

import Option from './Option/Option'


type LinkProps = {
  as?: React.ElementType
  href?: string
  target?: string
  onClick?: () => void
}

type DropdownOption = LinkProps & {
  title?: Intl.Message | string
  subTitle?: Intl.Message | string
  size?: TextSize
  logo?: LogoName
  icon?: IconName
  value: string
  isError?: boolean
}

export type DropdownProps = Omit<DropdownViewProps, 'children'> & {
  className?: string
  options: DropdownOption[]
  onChange?: (value: DropdownOption['value']) => void
}

const Dropdown: React.FC<DropdownProps> = (props) => {
  const { className, options, dataTestId, ...rest } = props

  return (
    <DropdownView
      className={className}
      dataTestId={dataTestId}
      {...rest}
    >
      {
        options.map(({ title, subTitle, value, logo, icon, isError, onClick, ...rest }, index) => (
          <ListboxOption
            key={index}
            as="div"
            value={value}
            data-testid={`${dataTestId}-option-${value}`}
            onClick={onClick}
            {...rest}
          >
            {
              ({ focus, selected }) => {
                const isSelected = typeof onClick === 'function' ? false : selected

                return (
                  <Option
                    title={title}
                    subTitle={subTitle}
                    logo={logo}
                    icon={icon}
                    active={isSelected}
                    focused={focus}
                    isError={isError}
                  />
                )
              }
            }
          </ListboxOption>
        ))
      }
    </DropdownView>
  )
}


export default React.memo(Dropdown)
