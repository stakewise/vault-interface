import { useConfig } from 'config'
import forms from 'modules/forms'
import { useStore } from 'hooks'


type Input = {
  field: Forms.Field<bigint>
}

const isEnvBurnDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_BURN)

const storeSelector = (store: Store) => ({
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
  hasMintBalance: store.vault.user.balances.mintToken.hasMintBalance,
})

const useBurnDisabled = (values: Input) => {
  const { field } = values

  const { hasMintBalance } = useStore(storeSelector)

  const { error } = forms.useFieldValue(field)
  const { address, isReadOnlyMode } = useConfig()

  const isBurnDisabled = (
    !address
    || Boolean(error)
    || isReadOnlyMode
    || !hasMintBalance // ?
    || isEnvBurnDisabled
  )

  return isBurnDisabled
}


export default useBurnDisabled
