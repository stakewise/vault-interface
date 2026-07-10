import React from 'react'
import { useConfig } from 'config'
import device from 'modules/device'

import { Chart } from 'components'
import { openConnectWalletModal } from 'layouts/modals/ConnectWalletModal/ConnectWalletModal'

import Mobile from './Mobile/Mobile'
import Desktop from './Desktop/Desktop'
import Skeleton from './Skeleton/Skeleton'
import { useChart, TabsItems, Tab, Type } from './util'


export type ChartWithFilterProps = {
  className?: string
  tabsItems: TabsItems
  vaultAddress: string
  dataTestId?: string
  showExtraRewards?: boolean
  noItemsDescription?: Intl.Message
  onExportButtonClick?: () => void
}

const ChartWithFilter: React.FC<ChartWithFilterProps> = (props) => {
  const {
    className,
    tabsItems,
    dataTestId,
    vaultAddress,
    showExtraRewards,
    noItemsDescription,
    onExportButtonClick,
  } = props

  const { sdk, address } = useConfig()
  const { isDesktop } = device.useData()

  const {
    data,
    form,
    options,
    isFetching,
    isExportButtonShown,
    values: { tab, type },
  } = useChart(tabsItems)

  const View = isDesktop ? Desktop : Mobile

  const isExtraRewardsTooltip = showExtraRewards && tab === Tab.User && type === Type.Rewards

  return (
    <View
      className={className}
      form={form}
      options={options}
      isFetching={isFetching}
      vaultAddress={vaultAddress}
      isExportButtonShown={isExportButtonShown}
      onExportButtonClick={onExportButtonClick}
    >
      <Chart
        className="mt-24"
        data={data}
        isFetching={isFetching}
        hideRightScale={!isDesktop}
        token={sdk.config.tokens.depositToken}
        showExtraRewards={isExtraRewardsTooltip}
        noItemsDescription={noItemsDescription}
        dataTestId={`${dataTestId}-${tab}-${type}`}
        style={type === Type.Rewards ? 'bar' : 'line'}
        pointType={type === Type.APY ? 'percent' : 'fiat'}
        isNotConnected={tab === Tab.User && !address}
        connect={openConnectWalletModal}
      />
    </View>
  )
}

const Component = {
  View: React.memo(ChartWithFilter),
  Tab: Tab,
  Skeleton,
}


export default Component
