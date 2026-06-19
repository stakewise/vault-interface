import { useCallback } from 'react'
import { modifiers, methods } from 'helpers'
import { useConfig } from 'config'
import { StakeWiseSDK } from 'sdk'
import forms from 'modules/forms'
import { useStore } from 'hooks'
import date from 'modules/date'

import { exportColumns } from './columns'
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
  totalBoostEarnedAssets: store.vault.user.balances.totalBoostEarnedAssets,
})

const formatFiat = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const useRewards = (input: Input) => {
  const { form, vaultAddress } = input

  const { sdk, address } = useConfig()

  const { currency, totalBoostEarnedAssets } = useStore(storeSelector)
  const { values: { from, to } } = forms.useFormValues<ExportForm>(form)

  const hasBoost = totalBoostEarnedAssets > 0n

  return useCallback(async () => {
    if (!address || !from || !to) {
      return
    }

    try {
      const fromInMs = date.time(from).utcOffset(0, false).valueOf()
      const toInMs = date.time(to).endOf('day').utcOffset(0, false).valueOf()

      const params: FetcherParams = {
        userAddress: address,
        dateTo: toInMs,
        dateFrom: fromInMs,
      }

      const mockE2E = methods.insertMockE2E<FetcherReturn>('user/setUserRewards')

      const data: FetcherReturn = mockE2E
        ? mockE2E
        : await sdk.vault.getUserRewards({ ...params, vaultAddress })

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
          dailyStakeRewards,
          dailyBoostRewards,
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
          stakeValue: dailyStakeRewards,
          boostValue: dailyBoostRewards,
          fiatValue: currentFiatValue[currency],
        })
      })

      const columns = exportColumns.filter((column) => hasBoost || !column.boostOnly)

      const rewards = response.map(({ date: rewardsDate, value, stakeValue, boostValue, fiatValue }) => {
        const formattedDate = modifiers.formatDateToNumerical(rewardsDate)

        const row = {
          stake: stakeValue,
          boost: boostValue,
          total: value,
          totalFiat: Number(fiatValue.replace(',', '.')),
          date: `${formattedDate} 00:00 UTC`,
        }

        return columns.map((column) => row[column.key])
      })

      return rewards
    }
    catch (error: any) {
      console.error('Fetch user rewards fail', error)
    }
  }, [ sdk, address, vaultAddress, currency, from, to, hasBoost ])
}


export default useRewards
