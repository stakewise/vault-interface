import React, { forwardRef } from 'react'
import cx from 'classnames'

import Image from '../Image/Image'
import type { IconName } from '../Image/Image'
import { constants } from '../../helpers'

import s from './Icon.module.scss'


export const sizes = [ 12, 16, 20, 24, 28, 32, 45 ] as const

type Color = typeof constants.colors[number]

export type IconProps = {
  className?: string
  name: IconName
  size?: typeof sizes[number]
  color?: Color | 'inherit'
  dataTestId?: string
}

const Icon = forwardRef<HTMLDivElement, IconProps>((props, ref) => {
  const { className, name, size = 16, color = 'dark', dataTestId } = props

  const arrowDirection = /arrows?\//.test(name)
    ? name.replace(/(new-)?arrows?\/(up)?/, '')
    : ''

  console.log({ name, arrowDirection })
  return (
    <Image
      ref={ref}
      className={cx(s[arrowDirection], className)}
      name={name}
      size={size}
      color={color}
      dataTestId={dataTestId}
    />
  )
})

Icon.displayName = 'Icon'


export default React.memo(Icon)
