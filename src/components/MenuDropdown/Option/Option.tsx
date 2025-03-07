import React from 'react'
import cx from 'classnames'

import { Icon, Logo, Text, IconName, LogoName } from 'components'

import OptionTitle from './OptionTitle/OptionTitle'

import s from './Option.module.scss'


export type OptionType = {
  ariaLabel?: Intl.Message | string
  subTitle?: Intl.Message | string
  title?: Intl.Message | string
  dataTestId?: string
  logo?: LogoName
  icon?: IconName
}

type OptionProps = OptionType & {
  className?: string
  active?: boolean
  withArrow?: boolean
  onClick?: () => void
}

const Option: React.FC<OptionProps> = (props) => {
  const { className, title, subTitle, logo, icon, active, withArrow, dataTestId, onClick } = props

  const titleClassName = cx('whitespace-nowrap flex-1', {
    'ml-12': logo || icon,
  })

  const buttonNode = (
    <div
      className={cx(s.option, className, 'flex items-center pl-16 pr-24 cursor-pointer', {
        'bg-primary/10': active,
        'h-48': !subTitle,
        'h-[52rem]': subTitle,
      })}
      data-testid={dataTestId}
      onClick={onClick}
    >
      {
        Boolean(logo || icon) && (
          <div className="rounded-full p-4 bg-dark/05">
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
        title && subTitle && (
          <div className={titleClassName}>
            <OptionTitle
              title={title}
              withArrow={withArrow}
            />
            <Text
              className="opacity-50"
              dataTestId={`${dataTestId}-subtitle`}
              message={subTitle}
              color="dark"
              size="t12"
            />
          </div>
        )
      }
      {
        title && !subTitle && (
          <OptionTitle
            className={titleClassName}
            title={title}
            withArrow={withArrow}
          />
        )
      }
    </div>
  )

  return buttonNode
}


export default React.memo(Option)
