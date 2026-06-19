import { useCallback, useMemo } from 'react'
import { requests, modifiers, methods } from 'helpers'
import forms from 'modules/forms'
import intl from 'modules/intl'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import type { ExportForm } from './useForm'
import { exportColumns } from './columns'
import messages from './messages'


type Input = {
  vaultAddress: string
  form: Forms.Form<ExportForm>
}

const storeSelector = (store: Store) => ({
  currency: store.currency.selected,
  totalBoostEarnedAssets: store.vault.user.balances.totalBoostEarnedAssets,
})

const useXLSX = (input: Input) => {
  const { vaultAddress, form } = input

  const { sdk, address } = useConfig()
  const { formatMessage } = intl.useIntl()
  const { currency, totalBoostEarnedAssets } = useStore(storeSelector)
  const { values: { from, to, format } } = forms.useFormValues<ExportForm>(form)

  const hasBoost = totalBoostEarnedAssets > 0n

  const titles = useMemo(() => {
    const columns = exportColumns.filter((column) => hasBoost || !column.boostOnly)

    return columns.map((column) => formatMessage(messages.file.headings[column.key], {
      token: sdk.config.tokens.depositToken,
      currency,
    }))
  }, [ hasBoost, currency, sdk, formatMessage ])

  return useCallback(async (data: (string | number)[][]) => {
    const response = await requests.fetchXlsxFile([ titles, ...data ], format)

    if (response && to && from && address) {
      const formattedFrom = modifiers.formatDateToNumerical(from)
      const formattedTo = modifiers.formatDateToNumerical(to)

      const shortVaultAddress = vaultAddress.slice(0, 7)
      const shortAddress = address.slice(0, 7)

      const formattedName = `${shortVaultAddress}-${shortAddress}-(${formattedFrom})-(${formattedTo}).${format}`

      methods.downloadFile(response, formattedName)
    }
  }, [ titles, address, vaultAddress, from, to, format ])
}


export default useXLSX
