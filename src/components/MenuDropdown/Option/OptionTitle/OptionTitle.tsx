import React from 'react'
import cx from 'classnames'

import { Icon, Text } from 'components'


type OptionTitleProps = {
  className?: string
  title: Intl.Message | string
  withArrow?: boolean
}

const OptionTitle: React.FC<OptionTitleProps> = (props) => {
  const { className, title, withArrow } = props

  if (withArrow) {
    return (
      <div className={cx(className, 'flex items-center')}>
        <Text
          className="flex-1"
          message={title}
          color="dark"
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
      color="dark"
      size="t14"
    />
  )
}


export default React.memo(OptionTitle)
