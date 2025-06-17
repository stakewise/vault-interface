import React, { Fragment, KeyboardEventHandler, ReactElement, ReactNode } from 'react'
import cx from 'classnames'
import { offset, shift, VirtualElement, OffsetOptions } from '@floating-ui/react'
import type { Placement } from '@floating-ui/react'
import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

import s from './Dropdown.module.scss'


type ButtonInput = {
  ref: (node: Element | VirtualElement | null) => void
  isOpen: boolean
}

export type DropdownViewProps = {
  className?: string
  children: ReactNode
  disabled?: boolean
  // The child component must inherit the props, so be sure to make <Foo {...props} />
  button: ReactElement | ((props: ButtonInput) => ReactElement)
  value?: string
  placement?: Placement
  withArrow?: boolean
  dataTestId?: string
  middleware?: {
    flip?: boolean
    shift?: boolean
    autoUpdate?: boolean
    offsetOptions?: Omit<OffsetOptions, 'number'>
  }
  onClose?: () => void
  onChange?: (value: any) => void
  onOptionsClick?: () => void
  onOptionsKeyDown?: KeyboardEventHandler<HTMLDivElement>
}

type DropdownViewComponent = React.FC<DropdownViewProps> & {
  Option: typeof ListboxOption
}

const DropdownView: DropdownViewComponent = (props: DropdownViewProps) => {
  const {
    className, children, button, value, disabled, withArrow, middleware,
    placement = 'bottom-end', dataTestId, onClose, onChange, onOptionsClick, onOptionsKeyDown,
  } = props

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware: [
      offset({
        mainAxis: 10,
        ...middleware?.offsetOptions,
      }),
      middleware?.shift ? shift({ padding: 6 }) : null,
      middleware?.flip ? flip({
        fallbackAxisSideDirection: 'start',
        padding: 6,
      }) : null,
    ],
    whileElementsMounted: middleware?.autoUpdate ? autoUpdate : undefined,
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

              if (typeof button === 'function') {
                return button({
                  ref: refs.setReference,
                  isOpen: open,
                })
              }

              return React.cloneElement<HTMLButtonElement>(button as any, {
                // @ts-ignore
                ref: refs.setReference,
                arrow: withArrow ? arrow : undefined,
              })
            }
          }
        </ListboxButton>
        <ListboxOptions
          ref={refs.setFloating}
          className={cx(s.options, 'absolute rounded-8 bg-background border border-dark/10 overflow-x-hidden overflow-y-auto shadow-md')}
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
