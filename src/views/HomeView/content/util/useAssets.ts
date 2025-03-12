import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { commonMessages } from 'helpers'
import forms from 'sw-modules/forms'

import type { Input, Position } from './types'


type Item = Position

const storeSelector = (store: Store) => ({
  stakedAssets: store.vault.user.balances.stake.assets,
})

const useAssets = ({ field, type }: Input) => {
  const { sdk } = useConfig()
  const { value, error } = forms.useFieldValue(field)
  const { stakedAssets } = useStore(storeSelector)

  const depositToken = sdk.config.tokens.depositToken

  return useMemo(() => {
    if (type === 'stake' || type === 'unstake') {
      const isValid = Number(value) && typeof value === 'bigint' && !error

      const prev: NonNullable<Item['tokenValue']>['prev'] = {
        value: stakedAssets,
        dataTestId: 'assets',
      }

      const next: NonNullable<Item['tokenValue']>['next'] = {
        value: null,
        dataTestId: 'assets',
      }

      if (isValid) {
        if (type === 'stake') {
          next.value = stakedAssets + value
        }

        if (type === 'unstake') {
          next.value = stakedAssets - value
        }
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
      }

      return result
    }

    return null
  }, [ value, error, type, depositToken, stakedAssets ])
}


export default useAssets
