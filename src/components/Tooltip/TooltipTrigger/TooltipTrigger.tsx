import React from 'react'

import type { TooltipData } from '../Tooltip'


type TooltipTriggerProps = {
  children: React.ReactNode
  dataTestId?: string
  wrapperClassName?: string
  data: TooltipData
}

type ExtendedProps  =  React.HTMLAttributes<HTMLDivElement> & {
  'data-state'?: string;
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = (props) => {
  const { children, wrapperClassName, data, ...otherProps } = props

  const ref = data.refs.setReference

  return React.createElement(
    'div',
    data.getReferenceProps({
      ref,
      ...otherProps,
      className: wrapperClassName,
      tabIndex: 0,
      role: 'button',
      'data-state': data.context.open ? 'open' : 'closed',
    } as ExtendedProps),
    children
  )
}


export default React.memo(TooltipTrigger)
