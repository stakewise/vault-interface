import { useCallback, useEffect, useMemo } from 'react'
import { useConfig } from 'config'
import { useObjectState } from 'hooks'

import useApprove from '../fetch/useApprove'
import useAllowance from '../fetch/useAllowance'


type State = {
  permitAddress: null | string
  isFetching: boolean
}

const useBoostAllowance = (vaultAddress: string | null) => {
  const { sdk, address, isGnosis } = useConfig()

  const [ { permitAddress, isFetching }, setState ] = useObjectState<State>({
    permitAddress: null,
    isFetching: Boolean(address && !isGnosis),
  })

  const skip = !permitAddress || isGnosis

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
    if (isGnosis) {
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
      console.error('fetchPermitAddress: can\'t get permit address', error as Error)

      setState({ isFetching: false })
    }
  }, [ sdk, vaultAddress, address, isGnosis, setState ])

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
