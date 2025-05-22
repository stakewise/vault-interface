import { useCallback, useEffect } from 'react'
import { useObjectState, useStore } from 'hooks'
import { useConfig } from 'config'


type ApiData = {
  apy: string
  token: string
  endTimestamp?: string
}

type State = {
  data: ApiData[]
  isFetching: boolean
}

const storeSelector = (store: Store) => ({
  apy: store.vault.base.data.apy,
  baseApy: store.vault.base.data.baseApy,
  vaultAddress: store.vault.base.data.vaultAddress,
})

const initialState: State = {
  isFetching: false,
  data: [],
}

const useApyDetails = () => {
  const { sdk } = useConfig()
  const { apy, baseApy, vaultAddress } = useStore(storeSelector)

  const [ state, setState ] = useObjectState<State>(initialState)

  const getPeriodicDistributions = useCallback(async () => {
    try {
      setState({ isFetching: true })

      const timestamp = Math.floor(Date.now() / 1000)

      const response = await sdk.vault.getPeriodicDistributions({
        endTimestamp: timestamp,
        startTimestamp: timestamp,
        vaultAddress: vaultAddress.toLowerCase(),
      })

      if (response.length) {
        setState({
          data: [
            ...response,
            {
              apy: String(baseApy),
              token: sdk.config.addresses.tokens.depositToken.toLowerCase(),
            },
          ],
          isFetching: false,
        })
      }

      setState({ isFetching: false })
    }
    catch {
      setState(initialState)
    }
  }, [ sdk, baseApy, vaultAddress, setState ])

  useEffect(() => {
    if (vaultAddress && apy !== baseApy) {
      getPeriodicDistributions()
    }
  }, [ apy, baseApy, vaultAddress, getPeriodicDistributions ])

  return state
}


export default useApyDetails
