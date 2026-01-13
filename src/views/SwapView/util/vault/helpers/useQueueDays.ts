import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'
import intl from 'modules/intl'

import messages from './messages'


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const storeSelector = (store: Store) => ({
  queueDays: store.mintToken.queueDays,
  avgQueueDays: store.vault.base.data.avgQueueDays,
})

const useQueueDays = () => {
  const { networkId } = useConfig()
  const { formatMessage } = intl.useIntl()
  const { queueDays, avgQueueDays } = useStore(storeSelector)

  return useMemo(() => {
    const network = capitalize(networkId)
    const durationString = formatMessage(messages.duration, { queueDays })
    const avgDurationString = avgQueueDays ? formatMessage(messages.avgDuration, { avgQueueDays }) : ''

    const durationTooltip = formatMessage(commonMessages.tooltip.duration, { network, queueDays })
    const avgDurationTooltip = avgQueueDays ? formatMessage(commonMessages.tooltip.avgDuration, { avgQueueDays }) : ''

    return [
      `${durationString} ${avgDurationString}`.trim(),
      `${durationTooltip} ${avgDurationTooltip}`.trim(),
    ]
  }, [
    networkId,
    queueDays,
    avgQueueDays,
    formatMessage,
  ])
}


export default useQueueDays
