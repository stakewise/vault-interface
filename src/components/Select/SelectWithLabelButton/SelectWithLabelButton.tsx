import React, { useId } from 'react'
import cx from 'classnames'

import Text from '../../Text/Text'
import Icon from '../../Icon/Icon'
import ButtonBase from '../../ButtonBase/ButtonBase'

import type { ButtonProps } from '../../Button/Button'
import type { IconName } from '../../Image/Image'

import s from './SelectWithLabelButton.module.scss'


type SelectWithLabelButtonProps = ButtonProps & {
  icon?: IconName
  disabled?: boolean
  isError?: boolean
  label: Intl.Message | string
  ref?: React.RefObject<HTMLButtonElement>
}

const SelectWithLabelButton: React.FC<SelectWithLabelButtonProps> = (props) => {
  const { className, title, label, icon, disabled, isError, ref, ...rest } = props

  const isFilled = title !== undefined

  const containerClassName = cx(s.container, 'w-full flex rounded-8 px-16', {
    [s.filled]: isFilled,
    [s.error]: isError,
    [s.disabled]: disabled,
    'opacity-50 cursor-default': disabled,
  })

  const controlId = useId()

  return (
    <ButtonBase
      className={cx(className, containerClassName)}
      disabled={disabled}
      ref={ref}
      {...rest}
    >
      <div className="w-full h-full inline-flex flex-col justify-center relative text-start">
        <Text
          className={cx(s.label, 'absolute left-0 w-full overflow-ellipsis whitespace-nowrap opacity-60')}
          message={label}
          tag="label"
          size={title ? 'xs' : 'sm'}
          color="dark"
          htmlFor={controlId}
        />
        <div className="flex text-start">
          <Text
            className="overflow-ellipsis whitespace-nowrap flex-1 mt-16 font-medium"
            message={title as string}
            color="dark"
            size="sm"
          />
          {
            Boolean(icon) && (
              <div className="ml-4 flex items-center">
                <Icon
                  className={s.icon}
                  color="dark"
                  name={icon as IconName}
                  size={16}
                />
              </div>
            )
          }
        </div>
      </div>
    </ButtonBase>
  )
}

SelectWithLabelButton.displayName = 'SelectWithLabelButton'


export default React.memo(SelectWithLabelButton)
