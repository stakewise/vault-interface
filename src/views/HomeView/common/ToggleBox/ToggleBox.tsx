import React from 'react'
import cx from 'classnames'

import { ButtonBase, Icon, AutoHeightToggle } from 'components'

import s from './ToggleBox.module.scss'


type ToggleBoxProps = {
  className?: string
  isOpen: boolean
  dataTestId?: string
  children: React.ReactNode
  toggleContent?: React.ReactNode
  ariaLabel?: string | Intl.Message
  handleOpen: () => void
}

const ToggleBox: React.FC<ToggleBoxProps> = (props) => {
  const { className, children, toggleContent, isOpen, dataTestId, ariaLabel, handleOpen } = props

  const containerClassName = cx(className, 'border rounded-8 border-dark/20')
  const arrowClassName = cx(s.arrow, 'absolute rounded-full')

  return (
    <AutoHeightToggle
      className={containerClassName}
      contentClassName="mt-12 pt-12 border-top border-dark/05"
      toggleContent={toggleContent}
      padding={24}
      isOpen={isOpen}
      dataTestId={dataTestId}
    >
      {children}
      {
        Boolean(toggleContent) && (
          <ButtonBase
            className={arrowClassName}
            ariaLabel={ariaLabel}
            dataTestId={dataTestId ? `${dataTestId}-toggle` : undefined}
            onClick={handleOpen}
          >
            <Icon
              name={isOpen ? 'arrow/up' : 'arrow/down'}
              color="white"
              size={16}
            />
          </ButtonBase>
        )
      }
    </AutoHeightToggle>
  )
}


export default React.memo(ToggleBox)
