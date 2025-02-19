import React from 'react'
import cx from 'classnames'

import Text from '../../Text/Text'
import ButtonBase, { ButtonBaseProps } from '../../ButtonBase/ButtonBase'

import s from './InputButton.module.scss'


type InputButtonProps = {
  className?: string
  disabled?: boolean
  title: Intl.Message | string
  dataTestId?: string
  onClick?: ButtonBaseProps['onClick']
}

const InputButton: React.FC<InputButtonProps> = (props) => {
  const { className, title, disabled, dataTestId, onClick } = props

  return (
    <ButtonBase
      className={cx(s.button, className, 'rounded-6 px-12')}
      disabled={disabled}
      dataTestId={dataTestId}
      onClick={onClick}
    >
      <Text
        message={title}
        size="t12"
        color="moon"
      />
    </ButtonBase>
  )
}


export default InputButton
