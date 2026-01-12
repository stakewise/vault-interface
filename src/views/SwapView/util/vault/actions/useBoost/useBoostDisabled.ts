import { useMemo } from 'react'
import { useStore } from 'hooks'
import forms from 'modules/forms'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'

import useBoostSupplyCapsCheck from './useBoostSupplyCapsCheck'

import messages from './messages'


type Input = {
  field: Forms.Field<bigint>
  maxBoostShares: bigint
  checkSupplyCap: ReturnType<typeof useBoostSupplyCapsCheck>['checkSupplyCap']
}

const isEnvBoostDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_BOOST)

const storeSelector = (store: Store) => ({
  vaultApy: store.vault.base.data.apy,
  maxBoostApy: store.vault.base.data.allocatorMaxBoostApy,
  isCollateralized: store.vault.base.data.isCollateralized,
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
})

const useBoostDisabled = (values: Input) => {
  const { field, maxBoostShares, checkSupplyCap } = values

  const {
    vaultApy,
    maxBoostApy,
    mintedShares,
    exitingPercent,
    isCollateralized,
  } = useStore(storeSelector)

  const { value, error } = forms.useFieldValue(field)
  const { sdk, address, isReadOnlyMode } = useConfig()

  const isBoostQueued = exitingPercent > 0
  const isBoostProfitable = maxBoostApy > vaultApy
  const isValidSupplyCap = error ? true : checkSupplyCap(value || 0n)

  const isBoostDisabled = (
    !address
    || isBoostQueued
    || !mintedShares
    || !maxBoostShares
    || Boolean(error)
    || isReadOnlyMode
    || !isCollateralized
    || !isValidSupplyCap
    || !isBoostProfitable
    || isEnvBoostDisabled
  )

  let boostDisabledTooltip: Intl.Message | undefined = undefined

  if (!mintedShares) {
    boostDisabledTooltip = {
      ...messages.boostTooltips.needMintToken,
      values: { mintToken: sdk.config.tokens.mintToken },
    }
  }

  if (!maxBoostShares) {
    boostDisabledTooltip = {
      ...messages.boostTooltips.needMintMore,
      values: { mintToken: sdk.config.tokens.mintToken },
    }
  }

  if (!isValidSupplyCap) {
    boostDisabledTooltip = commonMessages.invalidBoostSupplyCap
  }

  if (!isCollateralized) {
    boostDisabledTooltip = messages.boostTooltips.needValidators
  }

  if (!isBoostProfitable) {
    boostDisabledTooltip = messages.boostTooltips.boostNotProfitable
  }

  if (isBoostQueued) {
    boostDisabledTooltip = messages.boostTooltips.needFinishUnboost
  }

  return useMemo(() => ({
    boostDisabledTooltip,
    isBoostDisabled,
  }), [
    boostDisabledTooltip,
    isBoostDisabled,
  ])
}


export default useBoostDisabled
