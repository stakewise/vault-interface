import React, { forwardRef } from 'react'

import useIntl from './useIntl'


type MessageProps = {
  html?: boolean
  className?: string
  dataTestId?: string
  tag?: keyof React.ReactHTML
  value: string | Intl.Message
}

const Message = forwardRef<HTMLElement, MessageProps>((props, ref) => {
  const { className, value, dataTestId, tag = 'div', html } = props

  const intl = useIntl()

  let content = null

  if (typeof value === 'string') {
    if (!value) {
      console.error('Intl error: no value on Message component')
      return null
    }

    content = value
  }
  else {
    const { values, ...message } = value || {}

    content = intl.formatMessage(message, values)
  }

  if (html) {
    return React.createElement(tag, {
      ref,
      className,
      'data-testid': dataTestId,
      dangerouslySetInnerHTML: {
        __html: content,
      },
    })
  }

  return React.createElement(tag, {
    ref,
    className,
    'data-testid': dataTestId,
  }, content)
})

Message.displayName = 'Message'


export default Message
