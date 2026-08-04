import React from 'react'
import cx from 'classnames'

import { FiatAmount, Text, TokenAmount } from 'components'

import { Action } from '../enum'

import messages from './messages'


type FailedAction = Action.Receive | Action.ExitQueue

export type FailedTokenProps = {
  className?: string
  action: FailedAction
  token: Tokens
  value: bigint
}

const titles: Record<FailedAction, Intl.Message> = {
  [Action.Receive]: messages.receive,
  [Action.ExitQueue]: messages.addToQueue,
}

const FailedToken: React.FC<FailedTokenProps> = (props) => {
  const { className, token, value, action } = props

  const title = titles[action]

  return (
    <div
      className={cx(className, 'flex items-center justify-between border-top border-dark/10 py-16')}
    >
      <Text
        className="flex-1 font-medium"
        message={{
          ...title,
          values: { token },
        }}
        color="error"
        size="md"
        dataTestId={`action-${action}`}
      />
      <div>
        <TokenAmount
          className="justify-end"
          value={value}
          token={token}
          dataTestId={`action-${action}-value`}
        />
        <FiatAmount
          className="opacity-60 text-right mt-4"
          amount={value}
          token={token}
          color="dark"
          size="xs"
        />
      </div>
    </div>
  )
}


export default React.memo(FailedToken)
