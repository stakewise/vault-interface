import { useCallback, useMemo } from 'react'
import { requests, modifiers } from 'helpers'
import forms from 'sw-modules/forms'
import intl from 'sw-modules/intl'
import { useConfig } from 'config'
import { useStore } from 'hooks'
import methods from 'sw-methods'

import type { ExportForm } from './useForm'
import messages from './messages'


type Input = {
  vaultAddress: string
  form: Forms.Form<ExportForm>
}

const storeSelector = (store: Store) => ({
  currency: store.currency.selected,
})

const useXLSX = (input: Input) => {
  const { vaultAddress, form } = input

  const { sdk, address } = useConfig()
  const { formatMessage } = intl.useIntl()
  const { currency } = useStore(storeSelector)
  const { values: { from, to, format } } = forms.useFormValues<ExportForm>(form)

  const titles = useMemo(() => (
    Object.keys(messages.file.headings).map((key) => {
      const title = messages.file.headings[key as unknown as keyof typeof messages.file.headings]

      return formatMessage(title, { token: sdk.config.tokens.depositToken, currency })
    })
  ), [ currency, sdk, formatMessage ])

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
