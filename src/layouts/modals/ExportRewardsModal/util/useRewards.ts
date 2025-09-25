import { useCallback } from 'react'
import { modifiers } from 'helpers'
import { useConfig } from 'config'
import { StakeWiseSDK } from 'sdk'
import forms from 'modules/forms'
import { useStore } from 'hooks'
import date from 'modules/date'

import type { ExportForm } from './useForm'


type FetcherParams = {
  userAddress: string
  dateTo: number
  dateFrom: number
}

type FetcherReturn = Awaited<ReturnType<StakeWiseSDK['vault']['getUserRewards']>>

type Input = {
  vaultAddress: string
  form: Forms.Form<ExportForm>
}

const storeSelector = (store: Store) => ({
  currency: store.currency.selected,
})

const formatFiat = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const useRewards = (input: Input) => {
  const { form, vaultAddress } = input

  const { sdk, address } = useConfig()

  const { currency } = useStore(storeSelector)
  const { values: { from, to } } = forms.useFormValues<ExportForm>(form)

  return useCallback(async () => {
    if (!address || !from || !to) {
      return
    }

    try {
      const fromInMs = date.time(from).utcOffset(0, true).valueOf()
      const toInMs = date.time(to).utcOffset(0, true).valueOf()

      const params: FetcherParams = {
        userAddress: address,
        dateTo: toInMs,
        dateFrom: fromInMs,
      }

      const data: FetcherReturn = await sdk.vault.getUserRewards({
        ...params,
        vaultAddress,
      })

      const response = data.map((values) => {
        const {
          date,
          dailyRewards,
          dailyRewardsUsd,
          dailyRewardsEur,
          dailyRewardsGbp,
          dailyRewardsCny,
          dailyRewardsJpy,
          dailyRewardsKrw,
          dailyRewardsAud,
        } = values

        const currentFiatValue = {
          USD: formatFiat(dailyRewardsUsd),
          EUR: formatFiat(dailyRewardsEur),
          GBP: formatFiat(dailyRewardsGbp),
          CNY: formatFiat(dailyRewardsCny),
          JPY: formatFiat(dailyRewardsJpy),
          KRW: formatFiat(dailyRewardsKrw),
          AUD: formatFiat(dailyRewardsAud),
        }

        return ({
          date,
          value: dailyRewards,
          fiatValue: currentFiatValue[currency],
        })
      })

      const rewards = response.map(({ date: rewardsDate, value, fiatValue }) => {
        const formattedDate = modifiers.formatDateToNumerical(rewardsDate)
        const reportDate = `${formattedDate} 00:00 UTC`
        const formattedFiatValue = Number(fiatValue.replace(',', '.'))

        return [
          value,
          formattedFiatValue,
          reportDate,
        ]
      })

      return rewards
    }
    catch (error: any) {
      console.error('Fetch user rewards fail', error)
    }
  }, [ sdk, address, vaultAddress, currency, from, to ])
}


export default useRewards
