import React from 'react'
import cx from 'classnames'

import Text from '../../Text/Text'
import Icon from '../../Icon/Icon'
import ButtonBase from '../../ButtonBase/ButtonBase'


type BackButtonProps = {
  className?: string
  title?: Intl.Message | string
  onClick: () => void
}

const BackButton: React.FC<BackButtonProps> = (props) => {
  const { className, title, onClick } = props

  return (
    <ButtonBase
      className={cx(className, 'h-40 pb-8 px-12 mb-8 flex items-center w-full border-bottom border-dark/10')}
      onClick={onClick}
    >
      <Icon
        name="arrow/left"
        color="dark"
        size={16}
      />
      {
        title && (
          <Text
            className="flex-1 mr-16"
            message={title}
            size="t14"
            color="dark"
          />
        )
      }
    </ButtonBase>
  )
}


export default BackButton
