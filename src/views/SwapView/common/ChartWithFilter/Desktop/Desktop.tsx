import React from 'react'
import cx from 'classnames'

import { Select, Tabs } from 'components'

import { Options, Form } from '../util'
import { ExportButton, TimeRange, FiltersSkeleton } from '../common'


type DesktopProps = {
  className?: string
  options: Options
  isFetching: boolean
  vaultAddress: string
  form: Forms.Form<Form>
  children: React.ReactNode
  isExportButtonShown?: boolean
  onExportButtonClick?: () => void
}

const Desktop: React.FC<DesktopProps> = (props) => {
  const {
    className,
    children,
    form,
    options,
    isFetching,
    vaultAddress,
    isExportButtonShown,
    onExportButtonClick,
  } = props

  const controlsView = isFetching ? (
    <FiltersSkeleton className="pl-16 flex items-center gap-16" />
  ) : (
    <div className={cx(className, 'flex items-center gap-16')}>
      {
        isExportButtonShown && (
          <ExportButton
            vaultAddress={vaultAddress}
            onClick={onExportButtonClick}
          />
        )
      }
      <TimeRange field={form.fields.days} range={options.days} />
      <Select
        field={form.fields.type}
        options={options.types}
      />
    </div>
  )

  return (
    <Tabs
      className={className}
      tabsClassName="pl-16"
      tabsList={options.tabs}
      noteNode={controlsView}
      field={form.fields.tab}
      dataTestId="vault-chart"
      borderMin
    >
      {children}
    </Tabs>
  )
}


export default React.memo(Desktop)
