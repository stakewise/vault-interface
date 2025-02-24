import { useCallback, useRef } from 'react'
import { useConfig } from 'config'

import useStore from '../data/useStore'
import useActions from '../data/useActions'


type Output = {
  refetchMintTokenBalance: () => Promise<void>
  refetchNativeTokenBalance: () => Promise<void>
  refetchDepositTokenBalance: () => Promise<void>
}

const storeSelector = (store: Store) => ({
  balances: store.account.balances.data,
})

const useBalances = (): Output => {
  const actions = useActions()
  const { sdk, address } = useConfig()

  const { balances } = useStore(storeSelector)

  const balancesRef = useRef(balances)
  balancesRef.current = balances

  const isStakeNativeToken = sdk.config.tokens.depositToken === sdk.config.tokens.nativeToken

  const refetchNativeTokenBalance = useCallback(async () => {
    if (!address) {
      return
    }

    const balance = await sdk.contracts.helpers.multicallContract.getEthBalance(address)
    const isChanged = balancesRef.current.nativeTokenBalance !== balance

    if (isChanged) {
      actions.account.balances.setNativeTokenBalance(balance)
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

    const isChanged = balancesRef.current.depositTokenBalance !== balance

    if (isChanged) {
      actions.account.balances.setDepositTokenBalance(balance)
    }
  }, [ address, sdk, actions, isStakeNativeToken ])

  const refetchMintTokenBalance = useCallback(async () => {
    if (!address) {
      return
    }

    const balance = await sdk.contracts.tokens.mintToken.balanceOf(address)
    const isChanged = balancesRef.current.mintTokenBalance !== balance

    if (isChanged) {
      actions.account.balances.setMintTokenBalance(balance)
    }
  }, [ address, sdk, actions ])

  return {
    refetchDepositTokenBalance,
    refetchNativeTokenBalance,
    refetchMintTokenBalance,
  }
}


export default useBalances
