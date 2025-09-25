import { useMemo } from 'react'
import { useStore } from 'hooks'

import vaultHooks from '../../index'

import useBurnField from './useBurnField'
import useBurnSubmit from './useBurnSubmit'
import useBurnDisabled from './useBurnDisabled'
import useBurnTransactionPrice from './useBurnTransactionPrice'
import useFullUnstakeBurnAmount from './useFullUnstakeBurnAmount'


const storeSelector = (store: Store) => ({
  walletMintedShares: store.account.balances.mintToken,
  isBalancesFetching: store.vault.user.balances.isFetching,
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
})

type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const useBurn = (values: Input) => {
  const { fetchAllUserData } = values

  const { mintedShares, walletMintedShares, isBalancesFetching } = useStore(storeSelector)

  const field = useBurnField(mintedShares)
  const isBurnDisabled = useBurnDisabled({ field })
  const transactionPrice = useBurnTransactionPrice()
  const fullUnstakeBurnAmount = useFullUnstakeBurnAmount()
  const { isSubmitting, submit } = useBurnSubmit({ field, fetchAllUserData })

  const isBurnLoading = isSubmitting || isBalancesFetching

  const maxBurnShares = mintedShares > walletMintedShares
    ? walletMintedShares
    : mintedShares

  return useMemo(() => ({
    field,
    isBurnLoading,
    isBurnDisabled,
    transactionPrice,
    fullUnstakeBurnAmount,
    maxBurnShares,
    submit,
  }), [
    field,
    maxBurnShares,
    isBurnLoading,
    isBurnDisabled,
    transactionPrice,
    fullUnstakeBurnAmount,
    submit,
  ])
}

useBurn.mock = {
  maxBurnShares: 0n,
  transactionPrice: 0n,
  isBurnLoading: false,
  isBurnDisabled: false,
  fullUnstakeBurnAmount: null,
  field: {} as Forms.Field<bigint>,
  submit: () => Promise.resolve(),
} as ReturnType<typeof useBurn>


export default useBurn
