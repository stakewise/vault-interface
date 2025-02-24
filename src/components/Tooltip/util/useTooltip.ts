import { useState, useMemo } from 'react'
import {
  flip,
  shift,
  offset,
  useRole,
  useFocus,
  useHover,
  useDismiss,
  autoUpdate,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react'

import type { Placement } from '@floating-ui/react'


type Input = {
  placement?: Placement
};

const useTooltip = (values: Input) => {
  const { placement = 'top' } = values

  const [ open, setOpen ] = useState(false)

  const data = useFloating({
    open,
    placement,
    middleware: [
      offset(10),
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 6,
      }),
      shift({
        padding: 6,
      }),
    ],
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
  })

  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { styles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      transform: 'scale(0)',
    },
    open: {
      opacity: 1,
      transform: 'scale(1)',
    },
  })

  const interactions = useInteractions([ hover, focus, dismiss, role ])

  return useMemo(() => ({
      open,
      styles,
      ...interactions,
      ...data,
      setOpen,
    }),[ open, interactions, data, styles, setOpen ])
}


export default useTooltip
