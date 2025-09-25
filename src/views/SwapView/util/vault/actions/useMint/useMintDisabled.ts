import { useMemo } from 'react'
import { useConfig } from 'config'
import forms from 'modules/forms'
import { useStore } from 'hooks'

import messages from './messages'


type Input = {
  field: Forms.Field<bigint>
}

const isEnvMintDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_MINT)

const storeSelector = (store: Store) => ({
  stakedAssets: store.vault.user.balances.stakedAssets,
  isCollateralized: store.vault.base.data.isCollateralized,
})

const useMintDisabled = (values: Input) => {
  const { field } = values

  const { stakedAssets, isCollateralized } = useStore(storeSelector)

  const { error } = forms.useFieldValue(field)
  const { sdk, address, isReadOnlyMode } = useConfig()

  const isMintDisabled = (
    !address
    || isReadOnlyMode
    || !stakedAssets
    || Boolean(error)
    || isEnvMintDisabled
    || !isCollateralized
  )

  let mintDisabledTooltip: Intl.Message | undefined = undefined
  const { depositToken, mintToken } = sdk.config.tokens

  if (address && !stakedAssets) {
    mintDisabledTooltip = {
      ...messages.tooltipNeedStaking,
      values: { depositToken, mintToken },
    }
  }

  if (!isCollateralized) {
    mintDisabledTooltip = {
      ...messages.tooltipNeedValidators,
      values: { mintToken },
    }
  }

  return useMemo(() => ({
    mintDisabledTooltip,
    isMintDisabled,
  }), [
    mintDisabledTooltip,
    isMintDisabled,
  ])
}


export default useMintDisabled
