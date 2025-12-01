import { useMemo } from 'react'
import { useStore } from 'hooks'
import forms from 'modules/forms'
import { useConfig } from 'config'
import { commonMessages, methods } from 'helpers'

import type { LogoName } from 'components'

import type { Input } from './types'


const storeSelector = (store: Store) => ({
  stakedAssets: store.vault.user.balances.stakedAssets,
})

const useAssets = ({ field, type, depositAmount }: Input) => {
  const { sdk } = useConfig()
  const { value: fieldValue, error } = forms.useFieldValue(field)
  const { stakedAssets } = useStore(storeSelector)

  const value = depositAmount || fieldValue
  const depositToken = sdk.config.tokens.depositToken

  return useMemo(() => {
    if (type === 'stake' || type === 'unstake') {
      const isValid = Number(value) && typeof value === 'bigint' && !error

      const prev = methods.formatTokenValue(stakedAssets)

      let next = ''

      if (isValid) {
        if (type === 'stake') {
          next = methods.formatTokenValue(stakedAssets + value)
        }

        if (type === 'unstake') {
          next = methods.formatTokenValue(stakedAssets - value)
        }
      }

      const result = {
        text: {
          ...commonMessages.staked,
          values: { depositToken },
        },
        values: {
          prev,
          next,
        },
        logo: `token/${depositToken}` as LogoName,
        dataTestId: 'table-asset',
      }

      return result
    }

    return null
  }, [ value, error, type, depositToken, stakedAssets ])
}


export default useAssets
