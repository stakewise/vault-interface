import React from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import type { IconProps } from '../Icon/Icon'

import s from './Loading.module.scss'


export type LoadingProps = {
  className?: string
  color?: IconProps['color']
  size?: IconProps['size']
}

const Loading: React.FC<LoadingProps> = (props) => {
  const { className, color = 'moon', size = 16 } = props

  return (
    <Icon
      className={cx(className, s.loading)}
      name="icon/loader"
      color={color}
      size={size}
    />
  )
}


export default React.memo(Loading)
