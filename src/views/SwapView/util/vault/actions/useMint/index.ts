import { useMemo } from 'react'
import { useStore } from 'hooks'

import vaultHooks from '../../index'

import useMintField from './useMintField'
import useMintSubmit from './useMintSubmit'
import useMintHealth from './useMintHealth'
import useMintDisabled from './useMintDisabled'
import useMintTransactionPrice from './useMintTransactionPrice'


type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  isBalancesFetching: store.vault.user.balances.isFetching,
  maxMintShares: store.vault.user.balances.mintToken.maxMintShares,
})

const useMint = (values: Input) => {
  const { fetchAllUserData } = values

  const field = useMintField()
  const transactionPrice = useMintTransactionPrice()
  const { getStyleByHealth, getHealthFactor } = useMintHealth()
  const { isMintDisabled, mintDisabledTooltip } = useMintDisabled({ field })
  const { submit, isSubmitting } = useMintSubmit({ field, fetchAllUserData })
  const { maxMintShares, isBalancesFetching } = useStore(storeSelector)

  const isMintLoading = isBalancesFetching || isSubmitting

  return useMemo(() => ({
    field,
    maxMintShares,
    isMintLoading,
    isMintDisabled,
    transactionPrice,
    mintDisabledTooltip,
    getStyleByHealth,
    getHealthFactor,
    submit,
  }), [
    field,
    maxMintShares,
    isMintLoading,
    isMintDisabled,
    transactionPrice,
    mintDisabledTooltip,
    getStyleByHealth,
    getHealthFactor,
    submit,
  ])
}

useMint.mock = {
  ...useMintHealth.mock,
  maxMintShares: 0n,
  isMintLoading: false,
  transactionPrice: 0n,
  isMintDisabled: false,
  mintDisabledTooltip: undefined,
  field: {} as Forms.Field<bigint>,
  submit: () => Promise.resolve(),
} as ReturnType<typeof useMint>


export default useMint
