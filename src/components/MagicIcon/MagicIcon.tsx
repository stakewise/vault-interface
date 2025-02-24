import React from 'react'

import Logo from '../Logo/Logo'


export type MagicIconProps = {
  className?: string
}

const MagicIcon: React.FC<MagicIconProps> = (props) => {
  const { className } = props

  return (
    <Logo
      className={className}
      name="image/magic"
      size={20}
    />
  )
}


export default React.memo(MagicIcon)
