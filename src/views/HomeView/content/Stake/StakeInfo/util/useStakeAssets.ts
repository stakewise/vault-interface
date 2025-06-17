import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'
import forms from 'modules/forms'

import { Position as Item } from 'views/HomeView/content/util'
import { stakeCtx } from 'views/HomeView/StakeContext/util'


const storeSelector = (store: Store) => ({
  stakedAssets: store.vault.user.balances.stake.assets,
})

const useStakeAssets = () => {
  const { sdk } = useConfig()
  const { field, stake } = stakeCtx.useData()

  const { value, error } = forms.useFieldValue(field)
  const { stakedAssets } = useStore(storeSelector)

  const { getBuyAmount, isSwapQuoteFetching } = stake

  const depositToken = sdk.config.tokens.depositToken
  const swapToken = stake.swapTokens.selected

  return useMemo(() => {
    const inputValue = value || 0n
    const isValid = Number(value) && typeof value === 'bigint' && !error

    const amount = swapToken.address ? getBuyAmount(inputValue) : inputValue

    const prev: NonNullable<Item['tokenValue']>['prev'] = {
      value: stakedAssets,
      dataTestId: 'assets',
    }

    const next: NonNullable<Item['tokenValue']>['next'] = {
      value: null,
      dataTestId: 'assets',
    }

    if (isValid) {
      next.value = stakedAssets + amount
    }

    const result: Item = {
      title: {
        ...commonMessages.staked,
        values: { depositToken },
      },
      tokenValue: {
        prev,
        next,
        token: depositToken,
      },
      isFetching: isSwapQuoteFetching,
    }

    return result
  }, [ value, error, depositToken, stakedAssets, swapToken, getBuyAmount, isSwapQuoteFetching ])
}


export default useStakeAssets
