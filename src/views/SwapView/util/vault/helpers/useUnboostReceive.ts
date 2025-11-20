import { useMemo } from 'react'
import { useStore } from 'hooks'
import forms from 'modules/forms'
import { modifiers } from 'helpers'


const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  rewardAssets: store.vault.user.balances.boost.rewardAssets,
})

const useUnboostReceive = (percentField: Forms.Field<string>) => {
  const { value: percent } = forms.useFieldValue<string>(percentField)
  const { boostedShares, rewardAssets } = useStore(storeSelector)

  return useMemo(() => {
    const [ receiveShares ] = modifiers.splitPercent(boostedShares, percent)

    let receiveAssets = 0n

    if (rewardAssets) {
      const [ exitAssets ] = modifiers.splitPercent(rewardAssets, percent)

      receiveAssets = exitAssets
    }

    return {
      receiveShares,
      receiveAssets,
    }
  }, [ boostedShares, rewardAssets, percent ])
}


export default useUnboostReceive
