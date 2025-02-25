import React from 'react'
import cx from 'classnames'
import { commonMessages } from 'helpers'

import { FiatAmount, Text, TokenAmount } from 'components'

import { Action } from '../enum'

import messages from './messages'


export type TokenProps = {
  className?: string
  action: Action
  token: Tokens
  value: bigint
}

const titles: Record<Action, Intl.Message> = {
  [Action.Mint]: messages.minted,
  [Action.Burn]: messages.burned,
  [Action.Stake]: messages.staked,
  [Action.Boost]: messages.boosted,
  [Action.Unstake]: messages.unstaked,
  [Action.Receive]: messages.received,
  [Action.Redeemed]: messages.withdrawed,
  [Action.ClaimReward]: messages.unstaked,
  [Action.Exiting]: commonMessages.exitingToken,
  [Action.ExitQueue]: messages.addedToQueue,
}

const Token: React.FC<TokenProps> = (props) => {
  const { className, token, value, action } = props

  const title = titles[action]

  return (
    <div
      className={cx(className, 'flex items-center justify-between border-top border-moon/10 py-16')}
    >
      <Text
        className="flex-1"
        message={{
          ...title,
          values: { token },
        }}
        color="stone"
        size="t18m"
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
          color="moon"
          size="t12"
        />
      </div>
    </div>
  )
}


export default React.memo(Token)
