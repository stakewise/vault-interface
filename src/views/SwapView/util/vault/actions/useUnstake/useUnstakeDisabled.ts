import { constants } from 'helpers'
import { useConfig } from 'config'
import forms from 'modules/forms'
import { useStore } from 'hooks'


const isEnvUnstakeDisabled = Boolean(process.env.NEXT_PUBLIC_DISABLE_UNSTAKE)

const storeSelector = (store: Store) => ({
  stakedAssets: store.vault.user.balances.stakedAssets,
})

const useUnstakeDisabled = (field: Forms.Field<bigint>) => {
  const { stakedAssets } = useStore(storeSelector)

  const { isReadOnlyMode } = useConfig()
  const { error } = forms.useFieldValue(field)
  const hasStake = stakedAssets > constants.blockchain.minimalAmount

  return !hasStake || isReadOnlyMode || isEnvUnstakeDisabled || Boolean(error)
}


export default useUnstakeDisabled
