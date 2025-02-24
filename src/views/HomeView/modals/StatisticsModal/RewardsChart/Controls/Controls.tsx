import React from 'react'
import cx from 'classnames'

import { Select, type SelectProps } from 'components'

import type { Form } from '../util'

import TimeRange from './TimeRange/TimeRange'
import ExportButton from './ExportButton/ExportButton'
import FiltersSkeleton from './FiltersSkeleton/FiltersSkeleton'


type ControlsProps = {
  className?: string
  isFetching: boolean
  withExport: boolean
  form: Forms.Form<Form>
  daysOptions: SelectProps['options']
  chartTypeOptions: SelectProps['options']
  closeModal: () => void
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { className, form, isFetching, withExport, daysOptions, chartTypeOptions, closeModal } = props

  const filterClassName = 'flex items-center gap-16'

  if (isFetching) {
    return (
      <FiltersSkeleton className={filterClassName} />
    )
  }

  return (
    <div className={cx(className, 'flex items-center gap-16')}>
      {
        withExport && (
          <ExportButton closeModal={closeModal} />
        )
      }
      <TimeRange field={form.fields.days} range={daysOptions} />
      <Select
        field={form.fields.type}
        options={chartTypeOptions}
      />
    </div>
  )
}


export default React.memo(Controls)
