import { useMemo } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import forms from 'sw-modules/forms'
import { modifiers } from 'helpers'

import type { PositionProps } from '../ActionModal/Position/Position'
import type { Input } from './types'
import messages from './messages'


type Items = PositionProps['items']
type Item = Items[number]

const storeSelector = (store: Store) => ({
  totalShares: store.vault.user.balances.boost.totalShares,
})

const useBoostedShares = ({ field, type }: Input) => {
  const { sdk } = useConfig()
  const { totalShares } = useStore(storeSelector)

  const { value, error } = forms.useFieldValue<string | bigint>(field)

  return useMemo(() => {
    if (type === 'boost' || type === 'unboost') {
      const prev: NonNullable<Item['tokenValue']>['prev'] = {
        value: totalShares,
        dataTestId: 'boosted-shares',
      }

      const next: NonNullable<Item['tokenValue']>['next'] = {
        value: null,
        dataTestId: 'boosted-shares',
      }

      if (value && !error) {
        if (type === 'boost' && typeof value === 'bigint') {
          next.value = totalShares + value
        }

        if (type === 'unboost' && typeof value === 'string') {
          const [ exitShares ] = modifiers.splitPercent(totalShares, value)

          next.value = totalShares - exitShares
        }
      }

      const result: Item = {
        title: {
          ...messages.boosted,
          values: { mintToken: sdk.config.tokens.mintToken },
        },
        tokenValue: {
          token: sdk.config.tokens.mintToken,
          prev,
          next,
        },
      } as const

      return result
    }

    return null
  }, [ sdk, type, value, error, totalShares ])
}


export default useBoostedShares
