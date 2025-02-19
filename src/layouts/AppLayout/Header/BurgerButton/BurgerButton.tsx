import React from 'react'
import cx from 'classnames'
import { commonMessages } from 'helpers'

import { ButtonBase } from 'components'

import s from './BurgerButton.module.scss'


type BurgerButtonProps = {
  className?: string
  active: boolean
  dataTestId?: string
  onClick: () => void
}

const BurgerButton: React.FC<BurgerButtonProps> = (props) => {
  const { className, active, dataTestId, onClick } = props

  const lineClassName = cx(s.line, 'absolute bg-moon')

  const ariaLabel = active
    ? commonMessages.accessibility.closeMobileMenu
    : commonMessages.accessibility.openMobileMenu

  return (
    <ButtonBase
      className={cx(className, s.wrapper, 'h-[44rem]')}
      dataTestId={dataTestId}
      ariaLabel={ariaLabel}
      onClick={onClick}
    >
      <div
        className={cx(s.container, 'relative', {
          [s.active]: active,
        })}
      >
        <div className={cx(s.topLeft, lineClassName)} />
        <div className={cx(s.topRight, lineClassName)} />
        <div className={cx(s.middle, lineClassName)} />
        <div className={cx(s.bottomLeft, lineClassName)} />
        <div className={cx(s.bottomRight, lineClassName)} />
      </div>
    </ButtonBase>
  )
}


export default BurgerButton
