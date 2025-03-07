import React from 'react'
import cx from 'classnames'

import { Icon, Text } from 'components'

import messages from './messages'


type EmptyViewProps = {
  className?: string
}

const EmptyView: React.FC<EmptyViewProps> = (props) => {
  const { className } = props

  return (
    <div className={cx(className, 'flex flex-col justify-center items-center m-auto')}>
      <Icon
        name="icon/storage"
        color="dark"
        size={32}
      />
      <Text
        className="opacity-60 mt-24"
        message={messages.empty}
        size="t14"
        color="dark"
      />
    </div>
  )
}


export default React.memo(EmptyView)
