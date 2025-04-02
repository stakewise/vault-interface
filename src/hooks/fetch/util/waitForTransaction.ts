import notifications from 'modules/notifications'

import commonMessages from 'helpers/messages'


type Input = {
  hash: string
  provider: StakeWise.Provider
  onSuccess?: () => Promise<any>
}

const waitForTransaction = async ({ hash, provider, onSuccess }: Input) => {
  let isSuccess = false
  const thread = `tx-${Date.now()}`

  notifications.open({
    type: 'success',
    thread,
    text: commonMessages.notification.sent,
  })

  const receipt = await provider.waitForTransaction(hash)

  if (receipt?.status === 1) {
    isSuccess = true

    if (typeof onSuccess === 'function') {
      await onSuccess()
    }

    notifications.open({
      type: 'success',
      thread,
      text: commonMessages.notification.success,
    })
  }
  else {
    console.error('Failed transaction', undefined, {
      hash,
    })

    notifications.open({
      type: 'error',
      thread,
      text: commonMessages.notification.failed,
    })
  }

  return isSuccess
}


export default waitForTransaction
