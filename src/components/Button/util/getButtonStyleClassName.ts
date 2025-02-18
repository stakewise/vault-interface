import cx from 'classnames'


export const buttonColors = [
  'primary',
  'secondary',
  'textPrimary',
  'textSecondary',
  'destructive',
  'destructiveSecondary',
] as const

export type ButtonBgColor = typeof buttonColors[number]

type Input = {
  bgColor: ButtonBgColor
  loading?: boolean
  disabled?: boolean
}

const getButtonStyleClassName = ({ bgColor, loading, disabled }: Input) => {
  const [ primaryBgClassName, primaryBorderClassName, primaryContentClassName, primaryIconClassName ] = [
    cx({
      'bg-n300': disabled,
      'bg-p600 hover:bg-p500 active:bg-p500': !disabled,
    }),
    'border-transparent',
    'text-n0',
    'bg-n0',
  ]

  const [ secondaryBgClassName, secondaryBorderClassName, secondaryContentClassName, secondaryIconClassName ] = [
    cx({
      'bg-n50': disabled,
      'bg-p50 active:bg-p100 dark:focus-visible:outline-p600': !disabled,
    }),
    cx({
      'border-n200': disabled,
      'border-p200': !disabled,
      'hover:border-p100 active:border-p200': !loading && !disabled,
    }),
    cx({
      'text-n300': disabled,
      'text-p600': !disabled,
      'group-hover:text-p500 group-active:text-p700': !loading && !disabled,
    }),
    cx({
      'bg-n300': disabled,
      'bg-p600': !disabled,
      'group-hover:bg-p500 group-active:bg-p700': !loading && !disabled,
    }),
  ]

  const [ textPrimaryBgClassName, textPrimaryBorderClassName, textPrimaryContentClassName, textPrimaryIconClassName ] = [
    '',
    'border-transparent',
    cx({
      'text-n300': disabled,
      'text-p600': !disabled,
      'group-hover:text-p500 group-active:text-p700': !loading && !disabled,
    }),
    cx({
      'bg-n300': disabled,
      'bg-p600': !disabled,
      'group-hover:bg-p500 group-active:bg-p700': !loading && !disabled,
    }),
  ]

  const [ textSecondaryBgClassName, textSecondaryBorderClassName, textSecondaryContentClassName, textSecondaryIconClassName ] = [
    '',
    'border-transparent',
    cx({
      'text-n300': disabled,
      'text-n600': !disabled,
      'group-hover:text-n500 group-active:text-n700': !loading && !disabled,
    }),
    cx({
      'bg-n300': disabled,
      'bg-n600': !disabled,
      'group-hover:bg-n500 group-active:bg-n700': !loading && !disabled,
    }),
  ]

  const [ destructiveBgClassName, destructiveBorderClassName, destructiveContentClassName, destructiveIconClassName ] = [
    cx({
      'bg-n300': disabled,
      'bg-red600 hover:bg-red500 active:bg-red700 dark:focus-visible:outline-white': !disabled,
    }),
    'border-transparent',
    'text-n0 dark:text-white',
    'bg-n0',
  ]

  const [
    destructiveSecondaryBgClassName,
    destructiveSecondaryBorderClassName,
    destructiveSecondaryContentClassName,
    destructiveSecondaryIconClassName,
  ] = [
    cx({
      'bg-n50': disabled,
      'bg-red50 active:bg-red100 dark:focus-visible:outline-white': !disabled,
    }),
    cx({
      'border-n200': disabled,
      'border-red200': !disabled,
      'hover:border-red100 active:border-red200': !loading && !disabled,
    }),
    cx({
      'text-n300': disabled,
      'text-red600': !disabled,
      'group-hover:text-red500 group-active:text-red700': !loading && !disabled,
    }),
    cx({
      'bg-n300': disabled,
      'bg-red600': !disabled,
      'group-hover:bg-red500 group-active:bg-red700': !loading && !disabled,
    }),
  ]

  const [ styleClassName, contentClassName, iconClassName ] = (() => {
    if (bgColor === 'primary') {
      return [
        cx(primaryBgClassName, primaryBorderClassName),
        primaryContentClassName,
        primaryIconClassName,
      ]
    }
    if (bgColor === 'secondary') {
      return [
        cx(secondaryBgClassName, secondaryBorderClassName),
        secondaryContentClassName,
        secondaryIconClassName,
      ]
    }
    if (bgColor === 'textPrimary') {
      return [
        cx(textPrimaryBgClassName, textPrimaryBorderClassName),
        textPrimaryContentClassName,
        textPrimaryIconClassName,
      ]
    }
    if (bgColor === 'textSecondary') {
      return [
        cx(textSecondaryBgClassName, textSecondaryBorderClassName),
        textSecondaryContentClassName,
        textSecondaryIconClassName,
      ]
    }
    if (bgColor === 'destructive') {
      return [
        cx(destructiveBgClassName, destructiveBorderClassName),
        destructiveContentClassName,
        destructiveIconClassName,
      ]
    }
    if (bgColor === 'destructiveSecondary') {
      return [
        cx(destructiveSecondaryBgClassName, destructiveSecondaryBorderClassName),
        destructiveSecondaryContentClassName,
        destructiveSecondaryIconClassName,
      ]
    }

    return []
  })()

  const buttonStyleClassName = cx(
    styleClassName,
    'group border-2 border-solid'
  )

  return {
    buttonStyleClassName,
    buttonIconClassName: iconClassName,
    buttonContentClassName: contentClassName,
  }
}


export default getButtonStyleClassName
