import { useCallback, useRef } from 'react'
import { useConfig } from 'config'

import useActions from '../data/useActions'
import waitForTransaction from './util/waitForTransaction'


type Input = {
  hash: string
  count?: number
}

type ResolveTransactionProps = {
  hash: string
  expectedCount: number
}

const useSubgraphUpdate = () => {
  const actions = useActions()
  const { sdk } = useConfig()

  const configNetworkIdRef = useRef(sdk.config.network.id)
  configNetworkIdRef.current = sdk.config.network.id

  const resolveTransaction = useCallback(async (props: ResolveTransactionProps) => {
    const { hash, expectedCount } = props

    const isConfigChanged = configNetworkIdRef.current !== sdk.config.network.id

    if (!isConfigChanged) {
      const transactions = await sdk.utils.getTransactions({ hash })
      const count = transactions.length

      if (!count || count < expectedCount) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const promise = resolveTransaction(props)

            resolve(promise)
          }, 1000)
        })
      }
    }
  }, [ sdk ])

  return useCallback(async ({ hash, count = 1 }: Input) => {
    actions.ui.resetBottomLoader()

    if (!hash) {
      return Promise.reject()
    }

    actions.ui.setBottomLoaderTransaction(`${sdk.config.network.blockExplorerUrl}/tx/${hash}`)

    await waitForTransaction({
      hash,
      provider: sdk.provider,
      onSuccess: () => (
        resolveTransaction({
          hash,
          expectedCount: count,
        })
      ),
    })

    actions.ui.resetBottomLoader()
  }, [ sdk, actions, resolveTransaction ])
}


export default useSubgraphUpdate
