import { useCallback, useMemo, useState } from 'react'
import { useActions, useSubgraphUpdate } from 'hooks'
import { modifiers, commonMessages } from 'helpers'
import notifications from 'modules/notifications'
import { useConfig } from 'config'

import { Action, openTxCompletedModal } from 'layouts/modals/TxCompletedModal/TxCompletedModal'



type Input = {
  shares: bigint
  rewards: bigint
  vaultAddress: string | null
}

type SubmitInput = {
  percent: number
  onSuccess?: (hash: string) => Promise<void>
}

type TokenData = {
  token: Tokens
  value: bigint
  action: Action
}

const useUnboostSubmit = (values: Input) => {
  const { shares, rewards, vaultAddress } = values

  const actions = useActions()
  const { signSDK, address } = useConfig()

  const subgraphUpdate = useSubgraphUpdate()
  const [ isSubmitting, setSubmitting ] = useState(false)

  const submit = useCallback(async (values: SubmitInput) => {
    const { percent, onSuccess } = values

    if (!percent || !address || !vaultAddress) {
      return
    }

    try {
      actions.ui.setBottomLoader({
        content: commonMessages.notification.waitingConfirmation,
      })

      console.log({
        category: 'action',
        message: 'Submit unboost click',
      })

      setSubmitting(true)

      const hash = await signSDK.boost.unlock({
        percent,
        userAddress: address,
        vaultAddress: vaultAddress,
      })

      await subgraphUpdate({ hash })

      if (typeof onSuccess === 'function') {
        await onSuccess(hash)
      }

      const [ exitShares ] = modifiers.splitPercent(shares, percent)
      const [ exitAssets ] = modifiers.splitPercent(rewards, percent)

      const tokens: TokenData[] = [
        {
          token: signSDK.config.tokens.mintToken,
          value: exitShares,
          action: Action.Exiting,
        },
      ]

      if (exitAssets) {
        tokens.push({
          token: signSDK.config.tokens.depositToken,
          value: exitAssets,
          action: Action.Exiting,
        })
      }

      openTxCompletedModal({ tokens, hash })
    }
    catch (error) {
      actions.ui.resetBottomLoader()
      console.error('Unboost: submit failed', error as Error)

      notifications.open({
        text: commonMessages.notification.failed,
        type: 'error',
      })

      return Promise.reject(error)
    }
    finally {
      setSubmitting(false)
    }
  }, [
    shares,
    rewards,
    actions,
    address,
    signSDK,
    vaultAddress,
    subgraphUpdate,
  ])

  return useMemo(() => ({
    submit,
    isSubmitting,
  }), [
    submit,
    isSubmitting,
  ])
}


export default useUnboostSubmit
