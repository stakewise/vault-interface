import React, { useMemo } from 'react'
import cx from 'classnames'

import { Select } from 'components'
import type { SelectProps, TabsProps } from 'components'

import type { Form } from '../util'

import TimeRange from '../Controls/TimeRange/TimeRange'
import ExportButton from '../Controls/ExportButton/ExportButton'
import FiltersSkeleton from '../Controls/FiltersSkeleton/FiltersSkeleton'


type MobileViewProps = {
  className?: string
  isFetching: boolean
  form:  Forms.Form<Form>
  children: React.ReactNode
  isExportButtonShown: boolean
  tabsList: TabsProps['tabsList']
  daysOptions: SelectProps['options']
  chartTypeOptions: SelectProps['options']
  closeModal: () => void
}

const MobileView: React.FC<MobileViewProps> = (props) => {
  const {
    className,
    form,
    tabsList,
    children,
    isFetching,
    daysOptions,
    chartTypeOptions,
    isExportButtonShown,
    closeModal,
  } = props

  const tabsSelectOptions = useMemo(() => {
    return tabsList.map(({ title, id }) => ({
      title,
      value: id,
    }))
  }, [ tabsList ])

  const filterClassName = 'flex justify-between items-center mt-12'

  return (
    <div className={cx(className, 'relative')}>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Select
            className="z-20"
            field={form.fields.tab}
            options={tabsSelectOptions}
            placement="bottom-start"
          />
        </div>
        <Select
          field={form.fields.type}
          options={chartTypeOptions}
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
                range={daysOptions}
              />
              {
                isExportButtonShown && (
                  <ExportButton closeModal={closeModal} />
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}


export default React.memo(MobileView)
