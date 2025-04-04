import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import forms from 'modules/forms'
import { commonMessages } from 'helpers'

import type { Input, Position } from './types'


type Item = Position

const storeSelector = (store: Store) => ({
  mintedShares: store.vault.user.balances.mintToken.minted.shares,
})

const useShares = ({ field, type }: Input) => {
  const { sdk } = useConfig()
  const { mintedShares } = useStore(storeSelector)

  const { value, error } = forms.useFieldValue(field)

  const isValid = Boolean(value && !error)
  const mintToken = sdk.config.tokens.mintToken

  return useMemo(() => {
    if (type === 'mint' || type === 'burn') {
      const prev: NonNullable<Item['tokenValue']>['prev'] = {
        value: mintedShares,
        dataTestId: 'shares',
      }

      const next: NonNullable<Item['tokenValue']>['next'] = {
        value: null,
        dataTestId: 'shares',
      }

      if (isValid && value && typeof value === 'bigint') {
        if (type === 'mint') {
          next.value = mintedShares + value
        }

        if (type === 'burn') {
          next.value = mintedShares - value
        }
      }

      const result: Item = {
        title: {
          ...commonMessages.minted,
          values: { mintToken },
        },
        tokenValue: {
          prev,
          next,
          token: mintToken,
        },
      }

      return result
    }

    return null
  }, [ value, type, mintToken, mintedShares, isValid ])
}


export default useShares
