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

  const fetchTransaction = useCallback(async (hash: string, attempt: number = 0) => {
    try {
      const transactions = await sdk.utils.getTransactions({ hash })

      return transactions.length
    }
    catch (error) {
      if (attempt < 10) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 100))

        return fetchTransaction(hash, attempt + 1)
      }

      return Promise.reject(error)
    }
  }, [ sdk ])

  const resolveTransaction = useCallback(async (props: ResolveTransactionProps) => {
    const { hash, expectedCount } = props

    const count = await fetchTransaction(hash)
    const isConfigChanged = configNetworkIdRef.current !== sdk.config.network.id

    if (!isConfigChanged && (!count || count < expectedCount)) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const promise = resolveTransaction(props)

          resolve(promise)
        }, 1000)
      })
    }
  }, [ sdk, fetchTransaction ])

  return useCallback(async ({ hash, count = 1 }: Input) => {
    actions.ui.resetBottomLoader()

    if (!hash) {
      return Promise.reject('Empty hash on subgraphUpdate')
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
