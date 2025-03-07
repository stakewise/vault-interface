import React, { forwardRef } from 'react'
import cx from 'classnames'

import Text from '../Text/Text'
import Icon from '../Icon/Icon'

import s from './Counter.module.scss'


export type CounterProps = {
  disabled?: boolean
  className?: string
  count?: number
  isFetching?: boolean
}

const Counter = forwardRef<HTMLAnchorElement | HTMLDivElement, CounterProps>((props, ref) => {
  const { className, count, disabled = false, isFetching } = props

  const textColor = disabled ? 'secondary' : 'inherit'
  const counterClassName = cx(className, s.counter, 'px-6 rounded-24 inline-flex items-center justify-center', {
    [s.disabled]: disabled,
  })

  return (
    <span
      ref={ref}
      className={counterClassName}
    >
      {
        isFetching ? (
          <Icon
            className="rotate-360"
            name="icon/loader"
            color={textColor}
            size={16}
          />
        ) : (
          <Text
            tag="span"
            size="t12b"
            color={textColor}
            message={String(count)}
          />
        )
      }
    </span>
  )
})

Counter.displayName = 'Counter'

export default React.memo(Counter)
