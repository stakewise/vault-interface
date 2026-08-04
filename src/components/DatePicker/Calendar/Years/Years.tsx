import React from 'react'
import date from 'modules/date'

import Cell from '../Cell/Cell'


type YearsProps = {
  years: number[]
  yearMonth: string
  decadeStart: number
  selectedDate: Date.Time | null
  minimalDate: Date.Time | null
  maximalDate: Date.Time | null
  onSelect: (year: number) => void
}

const Years: React.FC<YearsProps> = (props) => {
  const { years, yearMonth, decadeStart, selectedDate, minimalDate, maximalDate, onSelect } = props

  const base = date.time(yearMonth, 'YYYY-MM')

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {
        years.map((value) => {
          const yearDate = base.set('year', value)

          const isDisabled = (
            minimalDate?.isAfter(yearDate.endOf('year'))
            || maximalDate?.isBefore(yearDate.startOf('year'))
          )

          return (
            <Cell
              key={value}
              className="w-full"
              title={String(value)}
              isActive={value >= decadeStart && value <= decadeStart + 9}
              isSelected={selectedDate?.year() === value}
              isDisabled={isDisabled}
              onClick={() => onSelect(value)}
            />
          )
        })
      }
    </div>
  )
}


export default React.memo(Years)
