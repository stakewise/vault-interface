import { useCallback, useMemo } from 'react'
import { useStore } from 'hooks'
import { openGuideModal } from 'layouts/modals/GuideModal/GuideModal'

import vaultHooks from '../../index'

import useBoostField from './useBoostField'
import useBoostSubmit from './useBoostSubmit'
import useBoostDisabled from './useBoostDisabled'
import useBoostSupplyCapsCheck from './useBoostSupplyCapsCheck'
import useBoostTransactionPrice from './useBoostTransactionPrice'


type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  vaultAddress: store.vault.base.data.vaultAddress,
  walletMintedShares: store.account.balances.mintToken,
  boostedShares: store.vault.user.balances.boost.shares,
  ltvPercent: store.vault.base.data.osTokenConfig.ltvPercent,
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
})

const useBoost = (values: Input) => {
  const { fetchAllUserData } = values

  const {
    ltvPercent,
    vaultAddress,
    mintedShares,
    boostedShares,
    walletMintedShares,
  } = useStore(storeSelector)

  const sharesDiff = mintedShares - boostedShares
  const vaultBalance = sharesDiff > 0n ? sharesDiff : 0n

  const maxBoostShares = vaultBalance > walletMintedShares
    ? walletMintedShares
    : vaultBalance

  const field = useBoostField(maxBoostShares)
  const transactionPrice = useBoostTransactionPrice()

  const { isFetching: isSupplyCapsFetching, checkSupplyCap } = useBoostSupplyCapsCheck()
  const { boostDisabledTooltip, isBoostDisabled } = useBoostDisabled({ field, maxBoostShares, checkSupplyCap })

  const { isSubmitting, isAllowanceFetching, submit } = useBoostSubmit({
    field,
    vaultAddress,
    fetchAllUserData,
  })

  const openModal = useCallback(() => {
    const ltv = BigInt(ltvPercent) === 999900000000000000n ? 100 : 90

    openGuideModal({ ltv })
  }, [ ltvPercent ])

  const isBoostLoading = isSubmitting || isAllowanceFetching || isSupplyCapsFetching

  return useMemo(() => ({
    field,
    maxBoostShares,
    isBoostLoading,
    isBoostDisabled,
    transactionPrice,
    boostDisabledTooltip,
    submit,
    openGuideModal: openModal,
  }), [
    field,
    maxBoostShares,
    isBoostLoading,
    isBoostDisabled,
    transactionPrice,
    boostDisabledTooltip,
    submit,
    openModal,
  ])
}

useBoost.mock = {
  maxBoostShares: 0n,
  transactionPrice: 0n,
  boostDisabledTooltip: undefined,
  isBoostLoading: false,
  isBoostDisabled: false,
  field: {} as Forms.Field<bigint>,
  submit: () => Promise.resolve(),
  openGuideModal: () => {},
} as ReturnType<typeof useBoost>


export default useBoost
