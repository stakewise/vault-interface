import React, { useMemo, useCallback } from 'react'
import { requests } from 'helpers'
import { useConfig } from 'config'

import { swapCtx } from 'views/SwapView/util'

import { ChartWithFilter } from '../../../common'
import type { ChartWithFilterProps } from '../../../common'

import messages from './messages'


type RewardsChartProps = {
  className?: string
  closeModal: () => void
}

type Fetcher = ChartWithFilterProps['tabsItems'][0]['fetcher']

const RewardsChart: React.FC<RewardsChartProps> = (props) => {
  const { className, closeModal } = props

  const { sdk, address } = useConfig()
  const { vaultAddress } = swapCtx.useData()

  const fetchUserData = useCallback<Fetcher>(async (days) => {
    if (!address) {
      return null
    }

    const data = await requests.user.fetchUserRewards({
      sdk,
      days,
      vaultAddress,
      userAddress: address,
    })

    return data
  }, [ sdk, address, vaultAddress ])

  const fetchVaultData = useCallback<Fetcher>(async (days) => {
    const data = await sdk.vault.getVaultStats({
      daysCount: days,
      vaultAddress,
    })

    return data.reverse().reduce((acc, { time, rewards, apy, balance }) => {
      acc.apy.push({
        time,
        value: apy,
      })

      acc.rewards.push({
        time,
        value: rewards,
      })

      acc.balance.push({
        time,
        value: balance,
      })

      return acc
    }, {
      apy: [],
      rewards: [],
      balance: [],
    } as NonNullable<Awaited<ReturnType<Fetcher>>>)
  }, [ sdk, vaultAddress ])

  const tabsItems = useMemo<ChartWithFilterProps['tabsItems']>(() => [
    {
      tab: ChartWithFilter.Tab.User,
      fetcher: fetchUserData,
    },
    {
      tab: ChartWithFilter.Tab.Vault,
      fetcher: fetchVaultData,
    },
  ], [ fetchUserData, fetchVaultData ])

  return (
    <ChartWithFilter.View
      className={className}
      tabsItems={tabsItems}
      dataTestId="stake-chart"
      vaultAddress={vaultAddress as string}
      noItemsDescription={messages.description}
      onExportButtonClick={closeModal}
    />
  )
}


export default React.memo(RewardsChart)
