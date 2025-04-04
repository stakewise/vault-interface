import { useMemo } from 'react'
import { useStore } from 'hooks'
import { modifiers } from 'helpers'
import forms from 'modules/forms'


type Input = {
  field: Forms.Field<string>
}

const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  rewardAssets: store.vault.user.balances.boost.rewardAssets,
})

const useReceive = (values: Input) => {
  const { field } = values

  const { value: percent } = forms.useFieldValue<string>(field)
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


export default useReceive
