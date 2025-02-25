import React from 'react'

import Text from '../../Text/Text'

import messages from './messages'


type NoItemsProps = {
  className?: string
  description?: Intl.Message
}

const NoItems: React.FC<NoItemsProps> = (props) => {
  const { className, description } = props

  return (
    <div className={className}>
      <div className="absolute h-full w-full flex items-center flex-col justify-center">
        <Text
          className="mt-16"
          message={messages.noItems}
          color="moon"
          size="t18m"
        />
        {
          description && (
            <Text
              className="mt-4 opacity-50 text-center"
              message={description}
              color="moon"
              size="t14m"
            />
          )
        }
      </div>
    </div>
  )
}


export default React.memo(NoItems)
