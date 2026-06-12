import React from 'react'
import cx from 'classnames'

import ButtonBase from '../../../ButtonBase/ButtonBase'
import Text from '../../../Text/Text'

import s from './Day.module.scss'


type DayProps = {
  className?: string
  title: string
  isActive?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  onClick: () => void
}

const Day: React.FC<DayProps> = (props) => {
  const { className, title, isActive, isSelected, isDisabled, onClick } = props

  const defaultClassName = cx({
    [s.fadeIn]: isActive,
    'opacity-30': !isActive,
    'bg-primary': isSelected,
    'hover:bg-primary/20': !isSelected && isActive,
    'hover:bg-primary/50': !isSelected && !isActive,
  })

  return (
    <ButtonBase
      className={cx(className, 'transition-opacity duration-500 rounded-4 py-4', {
        [defaultClassName]: !isDisabled,
        'opacity-10': isDisabled,
      })}
      disabled={isDisabled}
      onClick={onClick}
    >
      <Text
        message={title}
        size="t16m"
        color={isSelected && !isDisabled ? 'white' : 'dark'}
      />
    </ButtonBase>
  )
}


export default React.memo(Day)
