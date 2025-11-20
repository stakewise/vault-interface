import { useCallback, useEffect, useMemo } from 'react'
import { useConfig } from 'config'
import {
  useStore,
  useApprove,
  useAllowance,
  useObjectState,
} from 'hooks'


type State = {
  permitAddress: null | string
  isFetching: boolean
}

const storeSelector = (store: Store) => ({
  hasMintBalance: store.vault.user.balances.mintToken.hasMintBalance,
})

const useBoostAllowance = (vaultAddress: string | null) => {
  const { sdk, address, isGnosis, isTestnet } = useConfig()

  const { hasMintBalance } = useStore(storeSelector)

  const [ state, setState ] = useObjectState<State>({
    permitAddress: null,
    isFetching: Boolean(address && !isGnosis && hasMintBalance),
  })

  const { permitAddress, isFetching } = state

  const skip = !permitAddress || isGnosis || !hasMintBalance

  const { allowance, isFetching: isAllowanceFetching, checkAllowance } = useAllowance({
    tokenAddress: sdk.config.addresses.tokens.mintToken,
    recipient: permitAddress as string,
    skip,
  })

  const { approve } = useApprove({
    tokenAddress: sdk.config.addresses.tokens.mintToken,
    recipient: permitAddress as string,
    skip,
  })

  const fetchPermitAddress = useCallback(async () => {
    if (isGnosis || !hasMintBalance) {
      setState({ permitAddress: null, isFetching: false })

      return
    }

    try {
      let permitAddress: State['permitAddress'] = null

      if (address && vaultAddress) {
        setState({ isFetching: true })

        permitAddress = await sdk.boost.getLeverageStrategyProxy({
          userAddress: address,
          vaultAddress,
        })
      }

      setState({
        permitAddress,
        isFetching: false,
      })
    }
    catch (error) {
      if (!isTestnet) {
        console.error('fetchPermitAddress: can\'t get permit address', error as Error)
      }

      setState({ isFetching: false })
    }
  }, [ sdk, vaultAddress, address, isGnosis, isTestnet, hasMintBalance, setState ])

  useEffect(() => {
    fetchPermitAddress()
  }, [ fetchPermitAddress ])

  return useMemo(() => ({
    allowance,
    permitAddress,
    isFetching: isFetching || isAllowanceFetching,
    approve,
    checkAllowance,
  }), [
    allowance,
    permitAddress,
    isFetching,
    isAllowanceFetching,
    approve,
    checkAllowance,
  ])
}


export default useBoostAllowance
