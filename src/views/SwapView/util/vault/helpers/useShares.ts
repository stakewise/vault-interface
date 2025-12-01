import { useMemo } from 'react'
import { useStore } from 'hooks'
import forms from 'modules/forms'
import { useConfig } from 'config'
import { commonMessages, methods } from 'helpers'

import type { LogoName } from 'components'

import type { Input } from './types'


const storeSelector = (store: Store) => ({
  mintedShares: store.vault.user.balances.mintToken.mintedShares,
})

const useShares = (values: Input) => {
  const { type, field } = values

  const { sdk } = useConfig()
  const { mintedShares } = useStore(storeSelector)

  const { value, error } = forms.useFieldValue(field)

  const isValid = Boolean(value && !error)
  const mintToken = sdk.config.tokens.mintToken

  return useMemo(() => {
    if (type === 'mint' || type === 'burn') {
      const prev = methods.formatTokenValue(mintedShares)

      let next = ''

      if (isValid && value && typeof value === 'bigint') {
        if (type === 'mint') {
          next = methods.formatTokenValue(mintedShares + value)
        }

        if (type === 'burn') {
          next = methods.formatTokenValue(mintedShares - value)
        }
      }

      const result = {
        text: {
          ...commonMessages.minted,
          values: { mintToken },
        },
        values: {
          prev,
          next,
        },
        logo: `token/${mintToken}`  as LogoName,
        dataTestId: 'table-shares',
      }

      return result
    }

    return null
  }, [ type, mintedShares, isValid, value, mintToken ])
}


export default useShares
