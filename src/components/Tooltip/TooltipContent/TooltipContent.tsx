import React from 'react'
import cx from 'classnames'
import { FloatingPortal } from '@floating-ui/react'

import type { TooltipData } from '../Tooltip'

import s from './TooltipContent.module.scss'


type TooltipContentProps = {
  className?: string
  children: React.ReactNode
  textCenter?: boolean
  dataTestId?: string
  inModal?: boolean
  data: TooltipData
}

const TooltipContent: React.FC<TooltipContentProps> = (props) => {
  const { className, children, dataTestId, inModal, data, textCenter = true } = props

  if (!data.open) return null

  const tooltipsContainer = document.getElementById('tooltips') as HTMLElement
  const modalRoot = document.querySelector('[role="dialog"]') as HTMLElement

  return (
    <FloatingPortal root={inModal ? modalRoot : tooltipsContainer}>
      <div
        className="z-menu"
        ref={data.refs.setFloating}
        style={data.floatingStyles}
        {...data.getFloatingProps()}
      >
        <div
          className={cx(className, s.tooltip, 'bg-black overflow-hidden rounded-8', {
            'text-center': textCenter,
          })}
          data-testid={dataTestId}
          style={data.styles}
        >
          {children}
        </div>
      </div>
    </FloatingPortal>
  )
}


export default React.memo(TooltipContent)

