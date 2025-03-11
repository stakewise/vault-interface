import React from 'react'
import cx from 'classnames'

import Logo from '../../Logo/Logo'
import Loading from '../../Loading/Loading'
import Text, { TextSize, TextColor } from '../../Text/Text'
import Icon, { IconProps } from '../../Icon/Icon'
import { IconName, LogoName } from '../../Image/Image'


export type ButtonContentProps = {
  className?: string
  iconClassName?: string
  title?: Intl.Message | string
  titleSize: TextSize
  iconSize: IconProps['size']
  icon?: IconName
  logo?: LogoName
  arrow?: 'up' | 'down'
  color?: IconProps['color']
  loading?: boolean
}

const ButtonContent: React.FC<ButtonContentProps> = (props) => {
  const { className, iconClassName, title, icon, logo, color, arrow, iconSize, titleSize, loading } = props

  return (
    <div className={cx(className, 'flex items-center gap-8')}>
      {
        loading && (
          <Loading
            className={iconClassName}
            size={iconSize}
          />
        )
      }
      {
        Boolean(icon) && (
          <Icon
            className="flex-none"
            name={icon as IconName}
            color={color}
            size={iconSize}
          />
        )
      }
      {
        Boolean(logo) && (
          <Logo
            className="flex-none"
            name={logo as LogoName}
            size={iconSize}
          />
        )
      }
      {
        Boolean(title && !loading) && (
          <Text
            message={title as string}
            size={titleSize}
            color={color as TextColor}
          />
        )
      }
      {
        Boolean(arrow && !loading) && (
          <Icon
            className={iconClassName}
            name={`arrow/${arrow}` as IconName}
            size={iconSize}
            color={color}
          />
        )
      }
    </div>
  )
}


export default React.memo(ButtonContent)
