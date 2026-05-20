import React, { Fragment } from 'react'
import cx from 'classnames'
import { offset } from '@floating-ui/react'
import { autoUpdate, useFloating } from '@floating-ui/react-dom'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

import Input from '../Input/Input'
import type { InputProps } from '../Input/Input'

import Calendar, { CalendarProps } from './Calendar/Calendar'


export type DatePickerProps = Omit<InputProps, 'field'> & Omit<CalendarProps, 'onChange'>

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { className, field, minDate, maxDate, ...rest } = props

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(10),
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <Popover className={cx(className, 'relative')}>
      {({ close }) => (
        <>
          <PopoverButton as={Fragment} ref={refs.setReference}>
            {
              ({ open }) => (
                  <div
                    onClick={(event) => {
                      if (open) {
                        // prevent popover from closing on the input click
                        event.preventDefault()
                      }
                    }}
                  >
                    <Input
                      field={field}
                      {...rest}
                    />
                  </div>
              )
            }
          </PopoverButton>
          <PopoverPanel
            ref={refs.setFloating}
            className="p-16 rounded-8 bg-background border border-dark/10 shadow-md z-20"
            style={floatingStyles}
          >
            <Calendar
              field={field}
              minDate={minDate}
              maxDate={maxDate}
              onChange={close}
            />
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}


export default React.memo(DatePicker)
