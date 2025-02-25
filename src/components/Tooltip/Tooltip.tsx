import React from 'react'
import type { Placement } from '@floating-ui/react'

import Text from '../Text/Text'

import { useTooltip } from './util'
import TooltipContent from './TooltipContent/TooltipContent'
import TooltipTrigger from './TooltipTrigger/TooltipTrigger'


export type TooltipData = ReturnType<typeof useTooltip>

export type TooltipProps = {
  children: React.ReactNode
  content?: React.ReactNode | Intl.Message
  wrapperClassName?: string
  textCenter?: boolean
  dataTestId?: string
  placement?: Placement
  className?: string
  inModal?: boolean
}

const Tooltip: React.FC<TooltipProps> = props => {
  const {
    children,
    wrapperClassName,
    textCenter,
    dataTestId,
    placement,
    inModal,
    content,
  } = props

  const tooltip = useTooltip({ placement })

  if (!content) {
    return children
  }

  return (
    <>
      <TooltipTrigger
        data={tooltip}
        wrapperClassName={wrapperClassName}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent
        data={tooltip}
        inModal={inModal}
        textCenter={textCenter}
        dataTestId={dataTestId}
      >
        {
          React.isValidElement(content) ? (
            content
          ) : (
            <Text
              className="py-8 px-16"
              dataTestId={`${dataTestId}-content`}
              message={content as Intl.Message}
              color="snow"
              size="t12"
              html
            />
          )
        }
      </TooltipContent>
    </>
  )
}


export default React.memo(Tooltip)
