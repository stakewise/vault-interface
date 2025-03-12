import React from 'react'
import cx from 'classnames'
import { commonMessages } from 'helpers'

import { Text } from 'components'

import messages from './messages'


type HeaderProps = {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => (
  <div
    className={cx(className, 'py-16 grid border-bottom border-secondary/30')}
  >
    <Text
      message={messages.sender}
      color="dark"
      size="t14b"
    />
    <Text
      className="text-right"
      message={messages.recipient}
      color="dark"
      size="t14b"
    />
    <Text
      className="text-right"
      message={commonMessages.amount}
      color="dark"
      size="t14b"
    />
    <Text
      className="text-right"
      message={messages.date}
      color="dark"
      size="t14b"
    />
    <Text
      className="text-right"
      message={messages.txHash}
      color="dark"
      size="t14b"
    />
    <div />
  </div>
)


export default React.memo(Header)
