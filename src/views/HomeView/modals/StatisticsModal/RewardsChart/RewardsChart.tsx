import React, { useMemo, useRef } from 'react'
import { useIsomorphicLayoutEffect } from 'hooks'
import device from 'sw-modules/device'
import forms from 'sw-modules/forms'
import { useConfig } from 'config'
import cx from 'classnames'

import { Chart, Tabs } from 'components'

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

  const { isMobile } = device.useData()
  const { sdk, address, isAddressChanged } = useConfig()

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

  const tabs = useMemo(() => ({
    withUser: tabsOptions,
    noUser: tabsOptions.filter(({ id }) => id !== Tab.User),
  }), [ tabsOptions ])

  const withExport = tab === Tab.User && type === Type.Rewards && isExportVisible

  const tabsList = useMemo(() => {
    if (address && isExportVisible) {
      return tabs.withUser
    }

    return tabs.noUser
  }, [ address, tabs, isExportVisible ])

  const hasSetUserTabOnceRef = useRef(false)

  const isUserTabAlready = !hasSetUserTabOnceRef.current
    && isExportVisible
    && !isFetching

  useIsomorphicLayoutEffect(() => {
    if (isUserTabAlready) {
      form.fields.tab.setValue(tabs.withUser[0].id as Tab)
      hasSetUserTabOnceRef.current = true
    }

    if (isAddressChanged) {
      form.fields.tab.setValue(tabs.withUser[1].id as Tab)
      hasSetUserTabOnceRef.current = false
    }
  }, [ isAddressChanged, isUserTabAlready ])

  const controlsView = (
    <Controls
      className={cx({
        'mt-16 justify-between': isMobile,
      })}
      form={form}
      isFetching={isFetching}
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
      isFetching={isFetching}
      hideRightPriceScale={isMobile}
      token={sdk.config.tokens.depositToken}
      noItemsDescription={messages.description}
      dataTestId={`stake-chart-${tab}-${type}`}
      style={type === Type.Rewards ? 'bar' : 'line'}
      pointType={type === Type.APY ? 'percent' : 'fiat'}
    />
  )

  if (isMobile) {
    return (
      <MobileView
        className={className}
        form={form}
        tabsList={tabsList}
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
      tabsList={tabsList}
      noteNode={controlsView}
      field={form.fields.tab}
    >
      {chartsView}
    </Tabs>
  )
}


export default React.memo(RewardsChart)
