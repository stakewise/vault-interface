import React from 'react'
import cx from 'classnames'

import Text from '../Text/Text'
import Icon from '../Icon/Icon'

import s from './Counter.module.scss'


export type CounterProps = {
  disabled?: boolean
  className?: string
  count?: number
  isFetching?: boolean
  ref?: React.RefObject<HTMLAnchorElement>
}

const Counter: React.FC<CounterProps> = (props) => {
  const { className, count, disabled = false, ref, isFetching } = props

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
            color="secondary"
            size={16}
          />
        ) : (
          <Text
            className="font-bold"
            tag="span"
            size="xs"
            color="dark"
            message={String(count)}
          />
        )
      }
    </span>
  )
}

Counter.displayName = 'Counter'

export default React.memo(Counter)
