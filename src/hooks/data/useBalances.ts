import { useCallback, useRef } from 'react'
import { useConfig } from 'config'

import useStore from '../data/useStore'
import useActions from '../data/useActions'
import useSwapTokenBalances from './useSwapTokenBalances'


type Output = {
  refetchMintTokenBalance: () => Promise<void>
  refetchSwapTokenBalances: () => Promise<void>
  refetchNativeTokenBalance: () => Promise<void>
  refetchDepositTokenBalance: () => Promise<void>
}

const storeSelector = (store: Store) => ({
  balances: store.account.balances,
})

const useBalances = (): Output => {
  const actions = useActions()
  const { sdk, address } = useConfig()

  const { balances } = useStore(storeSelector)
  const fetchSwapTokenBalances = useSwapTokenBalances()

  const balancesRef = useRef(balances)
  balancesRef.current = balances

  const isStakeNativeToken = sdk.config.tokens.depositToken === sdk.config.tokens.nativeToken

  const refetchNativeTokenBalance = useCallback(async () => {
    if (!address) {
      return
    }

    const balance = await sdk.contracts.helpers.multicallContract.getEthBalance(address)
    const isChanged = balancesRef.current.nativeToken !== balance

    if (isChanged) {
      actions.account.balances.setNativeToken(balance)
    }
  }, [ address, sdk, actions ])

  const refetchDepositTokenBalance = useCallback(async () => {
    if (!address) {
      return
    }

    let balance = 0n

    if (isStakeNativeToken) {
      balance = await sdk.contracts.helpers.multicallContract.getEthBalance(address)
    }
    else {
      const depositTokenContract = sdk.contracts.helpers.createErc20(sdk.config.addresses.tokens.depositToken)

      balance = await depositTokenContract.balanceOf(address)
    }

    const isChanged = balancesRef.current.depositToken !== balance

    if (isChanged) {
      actions.account.balances.setDepositToken(balance)
    }
  }, [ address, sdk, actions, isStakeNativeToken ])

  const refetchMintTokenBalance = useCallback(async () => {
    if (!address) {
      return
    }

    const balance = await sdk.contracts.tokens.mintToken.balanceOf(address)
    const isChanged = balancesRef.current.mintToken !== balance

    if (isChanged) {
      actions.account.balances.setMintToken(balance)
    }
  }, [ address, sdk, actions ])

  const refetchSwapTokenBalances = useCallback(async () => {
    if (!address) {
      return
    }

    const balances = await fetchSwapTokenBalances()

    actions.account.swapTokenBalances.setData(balances)
  }, [ address, actions, fetchSwapTokenBalances ])

  return {
    refetchDepositTokenBalance,
    refetchNativeTokenBalance,
    refetchSwapTokenBalances,
    refetchMintTokenBalance,
  }
}


export default useBalances
