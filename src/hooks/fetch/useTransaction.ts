import { useCallback, useRef } from 'react'
import { useConfig } from 'config'

import useActions from '../data/useActions'
import waitForTransaction from './util/waitForTransaction'


const useTransaction = () => {
  const actions = useActions()
  const { sdk } = useConfig()

  const configNetworkIdRef = useRef(sdk.config.network.id)
  configNetworkIdRef.current = sdk.config.network.id

  return useCallback(async (hash: string) => {
    actions.ui.resetBottomLoader()

    if (!hash) {
      return Promise.reject()
    }

    actions.ui.setBottomLoaderTransaction(`${sdk.config.network.blockExplorerUrl}/tx/${hash}`)

    const isSuccess = await waitForTransaction({
      hash,
      provider: sdk.provider,
    })

    actions.ui.resetBottomLoader()

    return isSuccess
  }, [ sdk, actions ])
}


export default useTransaction
