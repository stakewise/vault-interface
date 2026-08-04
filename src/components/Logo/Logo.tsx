import React from 'react'
import theme from 'modules/theme'

import Image from '../Image/Image'
import type { ImageProps, LogoName } from '../Image/Image'


export type LogoProps = Omit<ImageProps, 'name' | 'color'> & {
  className?: string
  name: LogoName
  size?: number
  ref?: React.RefObject<HTMLDivElement>
}

type ImageName = ImageProps['name']

const themeDiffLogos: {
  dark: ImageName[]
  light: ImageName[]
} = {
  dark: [
    'token/ETH',
    'token/GNO',
  ],
  light: [],
}

const Logo: React.FC<LogoProps> = (props) => {
  const { className, name, size = 24, ref, ...rest } = props

  const { isDark } = theme.useData()

  let imageName: ImageName = name

  const isSpecialDark = themeDiffLogos.dark.includes(name)
  const isSpecialLight = themeDiffLogos.light.includes(name)

  if (isDark && isSpecialDark) {
    imageName = `${name}-dark` as ImageName
  }

  if (!isDark && isSpecialLight) {
    imageName = `${name}-light` as ImageName
  }

  return (
    <Image
      className={className}
      name={imageName}
      size={size}
      ref={ref}
      {...rest}
    />
  )
}

Logo.displayName = 'Logo'


export default React.memo(Logo)
