import React from 'react'
import cx from 'classnames'

import Logo from '../../Logo/Logo'
import Text from '../../Text/Text'
import Icon from '../../Icon/Icon'
import { IconName, LogoName } from '../../Image/Image'

import OptionTitle from './OptionTitle/OptionTitle'

import s from './Option.module.scss'


type OptionProps = {
  className?: string
  title?: Intl.Message | string
  subTitle?: Intl.Message | string
  logo?: LogoName
  icon?: IconName
  active?: boolean
  isError?: boolean
  withArrow?: boolean
  onClick?: () => void
}

const Option: React.FC<OptionProps> = (props) => {
  const { className, title, subTitle, logo, icon, active, isError, withArrow, onClick } = props

  const titleClassName = cx('whitespace-nowrap', {
    'ml-12': logo || icon,
  })

  return (
    <div
      className={cx(s.option, className, 'flex items-center pl-16 pr-24 cursor-pointer', {
        'bg-primary/10': active,
        [s.withSubTitle]: subTitle,
      })}
      onClick={onClick}
    >
      {
        Boolean(logo || icon) && (
          <div className={cx(s.logo, 'rounded-full p-4')}>
            {
              logo ? (
                <Logo
                  name={logo as LogoName}
                  size={24}
                />
              ) : (
                <Icon
                  name={icon as IconName}
                  size={24}
                  color="dark"
                />
              )
            }
          </div>
        )
      }
      {
        Boolean(title && subTitle) && (
          <div className={titleClassName}>
            <OptionTitle
              title={title as string}
              isError={isError}
              withArrow={withArrow}
            />
            <Text
              className="opacity-50"
              message={subTitle as string}
              size="t12"
              color="dark"
            />
          </div>
        )
      }
      {
        Boolean(title && !subTitle) && (
          <OptionTitle
            className={titleClassName}
            title={title as string}
            isError={isError}
            withArrow={withArrow}
          />
        )
      }
    </div>
  )
}


export default React.memo(Option)
