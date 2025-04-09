import React, { useRef } from 'react'
import device from 'modules/device'
import forms from 'modules/forms'
import { useConfig } from 'config'
import cx from 'classnames'

import { Chart, Tabs } from 'components'
import { openConnectWalletModal } from 'layouts/modals'

import Controls from './Controls/Controls'
import MobileView from './MobileView/MobileView'
import { useChartTabs, Tab, Type } from './util'

import messages from './messages'


type RewardsChartProps = {
  className?: string
  closeModal: () => void
}

const RewardsChart: React.FC<RewardsChartProps> = (props) => {
  const { className, closeModal } = props

  const { sdk, address } = useConfig()
  const { isMobile } = device.useData()

  const {
    form,
    points,
    isFetching,
    daysOptions,
    tabsOptions,
    isExportVisible,
    chartTypeOptions,
  } = useChartTabs()

  const { values: { type, tab } } = forms.useFormValues(form)

  const withExport = tab === Tab.User && type === Type.Rewards && isExportVisible
  const isNotConnected = tab === Tab.User && !address
  const isFetchedRef = useRef(false)
  isFetchedRef.current = isFetchedRef.current || !isFetching

  const controlsView = (
    <Controls
      className={cx({
        'mt-16 justify-between': isMobile,
      })}
      form={form}
      isFetching={isFetching && !isFetchedRef.current}
      withExport={withExport}
      daysOptions={daysOptions}
      chartTypeOptions={chartTypeOptions}
      closeModal={closeModal}
    />
  )

  const chartsView = (
    <Chart
      className="mt-24"
      data={points}
      isFetching={isFetching && !isNotConnected}
      hideRightScale={isMobile}
      token={sdk.config.tokens.depositToken}
      noItemsDescription={messages.description}
      dataTestId={`stake-chart-${tab}-${type}`}
      style={type === Type.Rewards ? 'bar' : 'line'}
      pointType={type === Type.APY ? 'percent' : 'fiat'}
      isNotConnected={isNotConnected}
      connect={openConnectWalletModal}
    />
  )

  if (isMobile) {
    return (
      <MobileView
        className={className}
        form={form}
        tabsList={tabsOptions}
        isFetching={isFetching}
        daysOptions={daysOptions}
        isExportButtonShown={withExport}
        chartTypeOptions={chartTypeOptions}
        closeModal={closeModal}
      >
        {chartsView}
      </MobileView>
    )
  }

  return (
    <Tabs
      className={className}
      borderMin
      tabsList={tabsOptions}
      noteNode={controlsView}
      field={form.fields.tab}
    >
      {chartsView}
    </Tabs>
  )
}


export default React.memo(RewardsChart)
