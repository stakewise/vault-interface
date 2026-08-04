import React, { useCallback, useMemo, useState } from 'react'
import forms from 'modules/forms'
import date from 'modules/date'
import cx from 'classnames'

import Days from './Days/Days'
import Years from './Years/Years'
import Months from './Months/Months'
import Header from './Header/Header'

import { useDays, getDate } from './util'


export type CalendarProps = {
  className?: string
  field: Forms.Field<string>
  minDate?: string
  maxDate?: string
  onChange?: () => void
}

type Level = 'month' | 'year' | 'decade'

const Calendar: React.FC<CalendarProps> = (props) => {
  const { className, field, minDate, maxDate, onChange } = props

  const [ level, setLevel ] = useState<Level>('month')

  const { value: selectedDay } = forms.useFieldValue(field)

  const {
    days, title, year, months, years, weekDays, yearMonth, isLocaleFetching,
    decadeStart, yearTitle, decadeTitle, setMonth, setYear, selectMonth, selectYear,
  } = useDays({ field })

  const minimalDate = useMemo(() => getDate(minDate), [ minDate ])
  const maximalDate = useMemo(() => getDate(maxDate), [ maxDate ])
  const selectedDate = useMemo(() => getDate(selectedDay), [ selectedDay ])

  const [ rangeStart, rangeEnd ] = useMemo(() => {
    const yearMonthDate = date.time(yearMonth, 'YYYY-MM')

    if (level === 'year') {
      return [ yearMonthDate.startOf('year'), yearMonthDate.endOf('year') ]
    }

    if (level === 'decade') {
      return [
        yearMonthDate.set('year', decadeStart).startOf('year'),
        yearMonthDate.set('year', decadeStart + 9).endOf('year'),
      ]
    }

    return [ yearMonthDate.startOf('month'), yearMonthDate.endOf('month') ]
  }, [ level, yearMonth, decadeStart ])

  const isLeftButtonDisabled = useMemo(() => (
    minimalDate ? !rangeStart.isAfter(minimalDate) : false
  ), [ rangeStart, minimalDate ])

  const isRightButtonDisabled = useMemo(() => (
    maximalDate ? !rangeEnd.isBefore(maximalDate) : false
  ), [ rangeEnd, maximalDate ])

  const headerTitle = {
    month: title,
    year: yearTitle,
    decade: decadeTitle,
  }[level]

  const handlePrev = useCallback(() => {
    if (level === 'month') {
      setMonth(-1)

      return
    }

    setYear(level === 'decade' ? -10 : -1)
  }, [ level, setMonth, setYear ])

  const handleNext = useCallback(() => {
    if (level === 'month') {
      setMonth(1)

      return
    }

    setYear(level === 'decade' ? 10 : 1)
  }, [ level, setMonth, setYear ])

  const handleTitleClick = useCallback(() => {
    setLevel(level === 'month' ? 'year' : 'decade')
  }, [ level ])

  const handleSelectDay = useCallback((fullDate: string) => {
    field.setValue(fullDate)

    if (typeof onChange === 'function') {
      onChange()
    }
  }, [ field, onChange ])

  const handleSelectMonth = useCallback((month: number) => {
    selectMonth(month)
    setLevel('month')
  }, [ selectMonth ])

  const handleSelectYear = useCallback((value: number) => {
    selectYear(value)
    setLevel('year')
  }, [ selectYear ])

  return (
    <div className={cx(className, 'w-[224px]')}>
      <Header
        title={headerTitle}
        isLocaleFetching={isLocaleFetching}
        isTitleDisabled={level === 'decade'}
        isLeftDisabled={isLeftButtonDisabled}
        isRightDisabled={isRightButtonDisabled}
        onPrev={handlePrev}
        onNext={handleNext}
        onTitleClick={handleTitleClick}
      />
      {
        level === 'month' && (
          <Days
            days={days}
            weekDays={weekDays}
            yearMonth={yearMonth}
            selectedDay={selectedDay}
            isLocaleFetching={isLocaleFetching}
            minimalDate={minimalDate}
            maximalDate={maximalDate}
            onSelect={handleSelectDay}
          />
        )
      }
      {
        level === 'year' && (
          <Months
            year={year}
            months={months}
            yearMonth={yearMonth}
            selectedDate={selectedDate}
            minimalDate={minimalDate}
            maximalDate={maximalDate}
            onSelect={handleSelectMonth}
          />
        )
      }
      {
        level === 'decade' && (
          <Years
            years={years}
            yearMonth={yearMonth}
            decadeStart={decadeStart}
            selectedDate={selectedDate}
            minimalDate={minimalDate}
            maximalDate={maximalDate}
            onSelect={handleSelectYear}
          />
        )
      }
    </div>
  )
}


export default React.memo(Calendar)
