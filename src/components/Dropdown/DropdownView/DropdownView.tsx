import React, { KeyboardEventHandler, ReactElement, ReactNode, useRef } from 'react'
import cx from 'classnames'
import type { Placement } from '@floating-ui/react'
import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom'
import { offset, shift, OffsetOptions } from '@floating-ui/react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

import s from './Dropdown.module.scss'


type ButtonInput = {
  isOpen: boolean
}

export type DropdownViewProps = {
  className?: string
  contentClassName?: string
  children: ReactNode
  disabled?: boolean
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
  button: (props: ButtonInput) => ReactElement
  onOpen?: () => void
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
    className, contentClassName, children, button, value, disabled, middleware,
    placement = 'bottom-end', dataTestId, onOpen, onClose, onChange, onOptionsClick, onOptionsKeyDown,
  } = props

  const isOpenRef = useRef(false)

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
        <ListboxButton as="div" ref={refs.setReference}>
          {
            ({ open }) => {
              if (open && !isOpenRef.current && typeof onOpen === 'function') {
                onOpen()
              }

              if (!open && isOpenRef.current && typeof onClose === 'function') {
                setTimeout(onClose)
              }

              isOpenRef.current = open

              return button({
                isOpen: open,
              })
            }
          }
        </ListboxButton>
        <ListboxOptions
          ref={refs.setFloating}
          className={cx(
            s.options,
            contentClassName,
            'absolute rounded-8 bg-background border border-dark/10 overflow-x-hidden overflow-y-auto shadow-md'
          )}
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
