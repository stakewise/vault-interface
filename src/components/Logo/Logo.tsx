import React from 'react'

import Image from '../Image/Image'
import type { ImageProps, LogoName } from '../Image/Image'


export type LogoProps = Omit<ImageProps, 'name' | 'color'> & {
  className?: string
  name: LogoName
  size?: number
  ref?: React.RefObject<HTMLDivElement>
}

const Logo: React.FC<LogoProps> = (props) => {
  const { className, name, size = 24, ref, ...rest } = props

  return (
    <Image
      className={className}
      name={name}
      size={size}
      ref={ref}
      {...rest}
    />
  )
}

Logo.displayName = 'Logo'


export default React.memo(Logo)
