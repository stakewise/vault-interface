import { useCallback } from 'react'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { mergeRewardsFiat, StakeWiseSDK } from 'sdk'
import date from 'modules/date'
import forms from 'modules/forms'
import { modifiers, requests } from 'helpers'

import type { ExportForm } from './useForm'


export type StatsType = 'osToken' | 'allocator'

type FetcherParams = {
  userAddress: string
  dateTo: number
  dateFrom: number
}

type FetcherReturn = Awaited<ReturnType<StakeWiseSDK['vault']['getUserRewards']>>

type Input = {
  vaultAddress: string
  statsType: StatsType
  form: Forms.Form<ExportForm>
}

const storeSelector = (store: Store) => ({
  currency: store.currency.selected,
})

const formatFiat = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const useRewards = (input: Input) => {
  const { form, statsType, vaultAddress } = input

  const { sdk, address } = useConfig()

  const { currency } = useStore(storeSelector)
  const { values: { from, to } } = forms.useFormValues<ExportForm>(form)

  const fetchAllocatorStats = useCallback((params: FetcherParams) => {
    return sdk.vault.getUserRewards({
      ...params,
      vaultAddress,
    })
  }, [ sdk, vaultAddress ])

  const fetchOsTokenStats = useCallback(async (params: FetcherParams) => {
    const {
      dateTo,
      dateFrom,
      userAddress,
    } = params

    const data = await requests.fetchStakeStats({
      url: sdk.config.api.subgraph,
      variables: {
        where: {
          osTokenHolder: userAddress.toLowerCase(),
          timestamp_gte: String(dateFrom * 1_000),
          timestamp_lte: String(dateTo * 1_000),
        },
      },
    })

    const rewards = data?.osTokenHolder || []

    const fiatRates = await sdk.utils.getFiatRatesByDay({ dateTo, dateFrom })

    return mergeRewardsFiat({ rewards, fiatRates })
  }, [ sdk ])

  return useCallback(async () => {
    if (!address || !from || !to) {
      return
    }

    try {
      const fromInMs = date.time(from).utcOffset(0, true).valueOf()
      const toInMs = date.time(to).utcOffset(0, true).valueOf()

      let data: FetcherReturn = []

      const params: FetcherParams = {
        userAddress: address,
        dateTo: toInMs,
        dateFrom: fromInMs,
      }

      if (statsType === 'osToken') {
        data = await fetchOsTokenStats(params)
      }
      else {
        data = await fetchAllocatorStats(params)
      }

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
  }, [ address, currency, from, to, statsType, fetchAllocatorStats, fetchOsTokenStats ])
}


export default useRewards
