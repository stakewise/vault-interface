import React from 'react'
import cx from 'classnames'

import Text from '../../../Text/Text'
import Icon from '../../../Icon/Icon'


type OptionTitleProps = {
  className?: string
  title: Intl.Message | string
  isError?: boolean
  withArrow?: boolean
}

const OptionTitle: React.FC<OptionTitleProps> = (props) => {
  const { className, title, isError, withArrow } = props

  if (withArrow) {
    return (
      <div
        className={cx(className, 'flex items-center')}
      >
        <Text
          message={title}
          color={isError ? 'error' : 'dark'}
          size="t14"
        />
        <Icon
          className="ml-8"
          name="arrow/right"
          color="dark"
          size={16}
        />
      </div>
    )
  }

  return (
    <Text
      className={className}
      message={title}
      color={isError ? 'error' : 'dark'}
      size="t14"
    />
  )
}


export default React.memo(OptionTitle)
