import React from 'react'
import cx from 'classnames'

import Icon, { IconProps } from '../../Icon/Icon'

import PaginationButton from '../PaginationButton/PaginationButton'


type ArrowButtonProps = {
  iconName: IconProps['name']
  disabled: boolean
  dataTestId?: string
  onClick: () => void
}

const ArrowButton: React.FC<ArrowButtonProps> = (props) => {
  const { iconName, disabled, dataTestId, onClick } = props

  return (
    <PaginationButton
      className={cx({
        'border-dark/10': disabled,
      })}
      disabled={disabled}
      dataTestId={dataTestId}
      onClick={onClick}
    >
      <Icon
        name={iconName}
        color={disabled ? 'secondary' : 'dark'}
        size={16}
      />
    </PaginationButton>
  )
}


export default React.memo(ArrowButton)
