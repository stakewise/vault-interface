import React from 'react'
import date from 'modules/date'

import Cell from '../Cell/Cell'


type MonthItem = {
  month: number
  title: string
}

type MonthsProps = {
  year: number
  months: MonthItem[]
  yearMonth: string
  selectedDate: Date.Time | null
  minimalDate: Date.Time | null
  maximalDate: Date.Time | null
  onSelect: (month: number) => void
}

const Months: React.FC<MonthsProps> = (props) => {
  const { year, months, yearMonth, selectedDate, minimalDate, maximalDate, onSelect } = props

  const base = date.time(yearMonth, 'YYYY-MM')

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {
        months.map(({ month, title }) => {
          const monthDate = base.set('month', month)

          const isDisabled = (
            minimalDate?.isAfter(monthDate.endOf('month'))
            || maximalDate?.isBefore(monthDate.startOf('month'))
          )
          const isSelected = selectedDate?.year() === year && selectedDate?.month() === month

          return (
            <Cell
              key={month}
              className="w-full capitalize"
              title={title}
              isActive
              isSelected={isSelected}
              isDisabled={isDisabled}
              onClick={() => onSelect(month)}
            />
          )
        })
      }
    </div>
  )
}


export default React.memo(Months)
