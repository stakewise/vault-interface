import React, { forwardRef } from 'react'

import Image from '../Image/Image'
import type { ImageProps, LogoName } from '../Image/Image'


export type LogoProps = Omit<ImageProps, 'name' | 'color'> & {
  className?: string
  name: LogoName
  size?: number
}

const Logo = forwardRef<HTMLDivElement, LogoProps>((props, ref) => {
  const { className, name, size = 24, ...rest } = props

  return (
    <Image
      className={className}
      name={name}
      size={size}
      {...rest}
    />
  )
})

Logo.displayName = 'Logo'


export default React.memo(Logo)
