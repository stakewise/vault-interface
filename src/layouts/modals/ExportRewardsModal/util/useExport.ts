import { useCallback, useMemo, useState } from 'react'
import notifications from 'modules/notifications'
import intl from 'modules/intl'

import useForm from './useForm'
import useXLSX from './useXLSX'
import messages from './messages'
import useRewards, { StatsType } from './useRewards'


export type Input = {
  vaultAddress: string
  statsType: StatsType
  closeModal: () => void
}

const useExport = (input: Input) => {
  const { vaultAddress, statsType, closeModal } = input

  const form = useForm()
  const intlRef = intl.useIntlRef()
  const getFile = useXLSX({ form, vaultAddress })
  const fetchRewards = useRewards({ form, statsType, vaultAddress })

  const [ isFetching, setFetching ] = useState<boolean>(false)

  const handleSubmit = useCallback(async () => {
    setFetching(true)
    const rewards = await fetchRewards()

    if (rewards?.length) {
      await getFile(rewards)

      notifications.open({
        type: 'success',
        text: messages.successfully,
      })

      closeModal()
    }
    else {
      const { from, to } = form.getValues()

      notifications.open({
        type: 'error',
        text: intlRef.current.formatMessage(messages.errors.noStats, { from, to }),
      })
    }

    setFetching(false)
  }, [ form, intlRef, closeModal, fetchRewards, getFile ])

  return useMemo(() => ({
    form,
    isFetching,
    onSubmit: handleSubmit,
  }), [
    form,
    isFetching,
    handleSubmit,
  ])
}


export default useExport
