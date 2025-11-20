import React, { useMemo } from 'react'
import cx from 'classnames'

import { Select } from 'components'

import { Options, Form } from '../util'
import { ExportButton, TimeRange, FiltersSkeleton } from '../common'


type MobileProps = {
  className?: string
  options: Options
  vaultAddress: string
  form: Forms.Form<Form>
  children: React.ReactNode
  isExportButtonShown?: boolean
  isFetching?: boolean
  onExportButtonClick?: () => void
}

const Mobile: React.FC<MobileProps> = (props) => {
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

  const tabsSelectOptions = useMemo(() => {
    return options.tabs.map(({ title, id }) => ({
      title,
      value: id,
    }))
  }, [ options.tabs ])

  const filterClassName = 'flex justify-between items-center mt-12'

  return (
    <div
      className={cx(className, 'relative')}
      data-testid="mobile-chart-with-filter"
    >
      <div className="pl-16 flex justify-between items-center">
        <div className="flex-1">
          <Select
            className="z-20"
            field={form.fields.tab}
            options={tabsSelectOptions}
            placement="bottom-start"
            data-testid="mobile-chart-filter-tabs-select"
          />
        </div>
        <Select
          className="z-menu"
          field={form.fields.type}
          options={options.types}
        />
      </div>
      <div className="mt-16">
        {children}
        {
          isFetching ? (
            <FiltersSkeleton className={filterClassName} />
          ) : (
            <div className={filterClassName}>
              <TimeRange
                field={form.fields.days}
                range={options.days}
              />
              {
                isExportButtonShown && (
                  <ExportButton
                    vaultAddress={vaultAddress}
                    onClick={onExportButtonClick}
                  />
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}


export default React.memo(Mobile)
