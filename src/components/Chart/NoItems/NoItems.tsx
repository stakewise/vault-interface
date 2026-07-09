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
          className="font-medium"
          message={messages.noItems}
          color="dark"
          size="lg"
        />
        {
          description && (
            <Text
              className="mt-4 opacity-50 text-center font-medium"
              message={description}
              color="dark"
              size="sm"
            />
          )
        }
      </div>
    </div>
  )
}


export default React.memo(NoItems)
