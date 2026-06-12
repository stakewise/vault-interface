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
  const { sdk, networkId, readOnlyProvider, getBlockExplorerUrl } = useConfig()

  const configNetworkIdRef = useRef(networkId)
  configNetworkIdRef.current = networkId

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
    const isConfigChanged = configNetworkIdRef.current !== networkId

    if (!isConfigChanged && (!count || count < expectedCount)) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const promise = resolveTransaction(props)

          resolve(promise)
        }, 1000)
      })
    }
  }, [ networkId, fetchTransaction ])

  return useCallback(async ({ hash, count = 1 }: Input) => {
    actions.ui.resetBottomLoader()

    if (!hash) {
      return Promise.reject('Empty hash on subgraphUpdate')
    }

    const blockExplorerUrl = getBlockExplorerUrl({ hash })

    actions.ui.setBottomLoaderTransaction(blockExplorerUrl)

    await waitForTransaction({
      hash,
      provider: readOnlyProvider,
      onSuccess: () => (
        resolveTransaction({
          hash,
          expectedCount: count,
        })
      ),
    })

    actions.ui.resetBottomLoader()
  }, [ actions, readOnlyProvider, resolveTransaction, getBlockExplorerUrl ])
}


export default useSubgraphUpdate
