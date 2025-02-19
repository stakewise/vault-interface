import React, { Fragment, KeyboardEventHandler, ReactElement, ReactNode } from 'react'
import cx from 'classnames'
import { offset, shift } from '@floating-ui/react'
import type { Placement } from '@floating-ui/react'
import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

import s from './Dropdown.module.scss'


export type DropdownViewProps = {
  className?: string
  children: ReactNode
  disabled?: boolean
  button: ReactElement // The child component must inherit the props, so be sure to make <Foo {...props} />
  value?: string
  placement?: Placement
  withArrow?: boolean
  dataTestId?: string
  onClose?: () => void
  onChange?: (value: any) => void
  onOptionsClick?: () => void
  onOptionsKeyDown?: KeyboardEventHandler<HTMLDivElement>
}

type DropdownViewComponent = React.FC<DropdownViewProps> & {
  Option: typeof ListboxOption
}

const DropdownView: DropdownViewComponent = (props) => {
  const {
    className, children, button, value, disabled, withArrow,
    placement = 'bottom-end', dataTestId, onClose, onChange, onOptionsClick, onOptionsKeyDown,
  } = props

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware: [
      offset(10),
      shift({ padding: 6 }),
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 6,
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <div className={cx(className, s.dropdown, 'inline-flex relative')}>
      <Listbox
        disabled={disabled}
        value={value}
        onChange={onChange}
      >
        <ListboxButton as={Fragment}>
          {
            ({ open }) => {
              const arrow = open ? 'up' : 'down'

              if (!open && typeof onClose === 'function') {
                setTimeout(onClose)
              }

              return React.cloneElement(button as ReactElement, {
                ref: refs.setReference,
                arrow: withArrow ? arrow : undefined,
              })
            }
          }
        </ListboxButton>
        <ListboxOptions
          ref={refs.setFloating}
          className={cx(s.options, 'absolute rounded-8 bg-mirror border border-moon/10 overflow-hidden shadow-md')}
          style={floatingStyles}
          data-testid={`${dataTestId}-options`}
          onClick={onOptionsClick}
          onKeyDown={onOptionsKeyDown}
        >
          {children}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}

DropdownView.Option = ListboxOption


export default DropdownView
