import React from 'react'

import useIntl from './useIntl'


type MessageProps = {
  html?: boolean
  className?: string
  dataTestId?: string
  tag?: React.HTMLElementType
  ref?: React.RefObject<HTMLElement>
  value: string | Intl.Message
}

const Message: React.FC<MessageProps> = (props) => {
  const { className, value, dataTestId, tag = 'div', ref, html } = props

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
}

Message.displayName = 'Message'


export default Message
