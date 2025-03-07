import React from 'react'

import Text from '../../Text/Text'
import Button from '../../Button/Button'

import messages from './messages'


type NotConnectedProps = {
  className?: string
  onClick?: () => void
}

const NotConnected: React.FC<NotConnectedProps> = (props) => {
  const { className, onClick } = props

  return (
    <div className={className}>
      <div className="absolute h-full w-full flex items-center flex-col justify-center">
        <Text
          message={messages.title}
          color="dark"
          size="t18m"
        />
        <Button
          className='mt-12'
          title={messages.buttonTitle}
          color="light"
          size="m"
          onClick={onClick}
        />
      </div>
    </div>
  )
}


export default React.memo(NotConnected)
