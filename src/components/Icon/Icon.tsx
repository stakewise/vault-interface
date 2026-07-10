import React from 'react'
import cx from 'classnames'

import Image from '../Image/Image'
import type { IconName } from '../Image/Image'
import { constants } from '../../helpers'

import s from './Icon.module.scss'


export const sizes = [ 12, 16, 20, 24, 28, 32, 45, 64 ] as const

type Color = typeof constants.colors[number]

export type IconProps = {
  className?: string
  name: IconName
  size?: typeof sizes[number]
  color?: Color | 'inherit'
  ref?: React.RefObject<HTMLDivElement>
  dataTestId?: string
}

const getArrowDirection = (name: string) => {
  if (!name.startsWith('arrow')) {
    return
  }

  const [ , dir ] = name.split('/')

  return dir
}

const Icon: React.FC<IconProps> = (props) => {
  const { className, name, size = 16, color = 'dark', ref, dataTestId } = props

  const arrowDirection = getArrowDirection(name)

  return (
    <Image
      ref={ref}
      className={cx(className, s.icon, {
        [`${s[arrowDirection as string]}`]: arrowDirection,
      })}
      name={name}
      size={size}
      color={color}
      dataTestId={dataTestId}
    />
  )
}

Icon.displayName = 'Icon'


export default React.memo(Icon)
