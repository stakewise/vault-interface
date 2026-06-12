import React from 'react'
import Image from 'next/image'

import Logo from '../Logo/Logo'
import type { LogoName } from '../Image/Image'


export type WalletIconProps = {
  name?: string
  size?: number
  logo?: LogoName | string
}

const isExternalLogo = (logo: string) => (
  logo.startsWith('data:') || logo.startsWith('http://') || logo.startsWith('https://')
)

const WalletIcon: React.FC<WalletIconProps> = (props) => {
  const { logo, name = '', size = 48 } = props

  if (!logo) {
    return null
  }

  if (isExternalLogo(logo)) {
    return (
      <Image
        src={logo}
        unoptimized
        width={size}
        height={size}
        alt={`${name} logo`}
        style={{ width: size, height: size }}
      />
    )
  }

  return <Logo name={logo as LogoName} size={size} />
}


export default React.memo(WalletIcon)
