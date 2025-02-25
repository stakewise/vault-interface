import React from 'react'
import cx from 'classnames'

import ButtonBase from '../../ButtonBase/ButtonBase'

import s from './PaginationButton.module.scss'


type PaginationButtonProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  isActive?: boolean
  dataTestId?: string
  onClick: () => void
}

const PaginationButton: React.FC<PaginationButtonProps> = (props) => {
  const { className, children, disabled, isActive, dataTestId, onClick } = props

  const buttonClassName = cx(
    s.button,
    className,
    'flex items-center justify-center border border-stone/30 rounded-8 h-32 w-32',
    {
      [s.active]: isActive,
    }
  )

  return (
    <ButtonBase
      className={buttonClassName}
      type="button"
      disabled={disabled}
      dataTestId={dataTestId}
      onClick={onClick}
    >
      {children}
    </ButtonBase>
  )
}

export default React.memo(PaginationButton)
