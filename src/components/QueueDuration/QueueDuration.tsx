import React from 'react'
import date from 'sw-modules/date'
import intl from 'sw-modules/intl'
import { commonMessages } from 'helpers'

import { Text } from 'components'

import messages from './messages'


export type QueueDurationProps = {
  duration: null | number
  isClaimable: boolean
  dataTestId?: string
}

const QueueDuration: React.FC<QueueDurationProps> = (props) => {
  const { duration, isClaimable, dataTestId } = props

  const now = date.time()
  const intlRef = intl.useIntlRef()

  const timeThen = date.time.unix(duration || 0)
  const difference = date.time.duration(timeThen.diff(now))
  const daysLeft = Math.floor(difference.asDays())

  const days = `${daysLeft}${intlRef.current.formatMessage(commonMessages.time.days)}`
  const estimatedTime = `~24${intlRef.current.formatMessage(commonMessages.time.hours)}`

  const timeLeft = daysLeft > 0 ? days : estimatedTime

  if (duration === null) {
    return (
      <Text
        className="flex-1 opacity-50"
        message={messages.calculating}
        color="moon"
        size="t12"
        dataTestId={dataTestId}
      />
    )
  }

  if (duration > 0) {
    return (
      <Text
        className="flex-1 opacity-50"
        message={{
          ...messages.timeLeft,
          values: {
            time: timeLeft,
          },
        }}
        color="moon"
        size="t12"
        dataTestId={dataTestId}
      />
    )
  }

  if (duration === 0 && !isClaimable) {
    return (
      <Text
        className="flex-1 opacity-50"
        message={{
          ...messages.timeLeft,
          values: {
            time: estimatedTime,
          },
        }}
        color="moon"
        size="t12"
        dataTestId={dataTestId}
      />
    )
  }

  return null
}


export default React.memo(QueueDuration)
