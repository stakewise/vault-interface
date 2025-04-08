import { useCallback, useEffect, useRef } from 'react'
import { useConfig } from 'config'
import { useActions } from 'hooks'
import { requests } from 'helpers'
import notifications from 'modules/notifications'

import messages from './messages'


const useAccount = () => {
  const actions = useActions()
  const { sdk, address } = useConfig()

  const addressRef = useRef<string>()

  const fetchDistributorClaims = useCallback(async (address: string) => {
    try {
      actions.account.distributorClaims.resetData()

      const result = await requests.fetchDistributorClaims({
        url: sdk.config.api.subgraph,
        address,
      })

      actions.account.distributorClaims.setData(result || {})
    }
    catch (error) {
      notifications.open({
        type: 'error',
        text: messages.error,
      })

      console.error('Fetch distributor claims error', error as Error)
    }
  }, [ sdk, actions ])

  useEffect(() => {
    if (address) {
      addressRef.current = address

      fetchDistributorClaims(address)
    }
    else {
      if (addressRef.current) {
        actions.account.balances.resetData()
        actions.account.distributorClaims.resetData()
      }
    }
  }, [
    sdk,
    address,
    actions,
    fetchDistributorClaims,
  ])
}


export default useAccount
