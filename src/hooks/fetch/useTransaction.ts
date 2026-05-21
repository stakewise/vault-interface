import { useCallback, useRef } from 'react'
import { useConfig } from 'config'

import useActions from '../data/useActions'
import waitForTransaction from './util/waitForTransaction'


const useTransaction = () => {
  const actions = useActions()
  const { networkId, readOnlyProvider, getBlockExplorerUrl } = useConfig()

  const configNetworkIdRef = useRef(networkId)
  configNetworkIdRef.current = networkId

  return useCallback(async (hash: string) => {
    actions.ui.resetBottomLoader()

    if (!hash) {
      return Promise.reject()
    }

    const blockExplorerUrl = getBlockExplorerUrl({ hash })

    actions.ui.setBottomLoaderTransaction(blockExplorerUrl)

    const isSuccess = await waitForTransaction({
      hash,
      provider: readOnlyProvider,
    })

    actions.ui.resetBottomLoader()

    return isSuccess
  }, [ actions, readOnlyProvider, getBlockExplorerUrl ])
}


export default useTransaction
