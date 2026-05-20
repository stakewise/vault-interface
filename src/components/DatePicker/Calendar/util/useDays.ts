import { useCallback, useMemo } from 'react'
import intl from 'modules/intl'
import date from 'modules/date'
import { useChangeEffect, useFieldListener, useObjectState } from 'hooks'


type GetCalendarRangeInput = {
  firstDay: Date.Time
  lastDay: Date.Time
}

type Input = {
  field: Forms.Field<string>
  animationDuration: number
}

const format = 'YYYY-MM'

const useDays = ({ field, animationDuration }: Input) => {
  const time = date.useTime()
  const { locale } = intl.useIntl()

  const parseFieldDate = useCallback(() => {
    const [ year, month ] = field.value?.split('-') || []

    const result: Record<string, number> = {}

    if (year?.length === 4) {
      result.year = Number(year)
    }
    if (month?.length === 2) {
      result.month = Number(month)
    }

    return result
  }, [ field ])

  const getStateFromField = useCallback((initialDate?: string) => {
    const { year, month } = parseFieldDate()

    let currentDate = initialDate ? time(initialDate, format) : time()

    if (year) {
      currentDate = currentDate.set('year', year)
    }
    if (month) {
      // in day js months are zero-based
      currentDate = currentDate.set('month', month - 1)
    }

    const yearMonth = currentDate.format(format)
    const initialYearMonth = yearMonth

    return { yearMonth, initialYearMonth }
  }, [ time, parseFieldDate ])

  const [ { yearMonth, initialYearMonth }, setState ] = useObjectState(getStateFromField())

  const onFieldChange = useCallback(() => {
    setState({ yearMonth: getStateFromField(yearMonth).yearMonth })
  }, [ yearMonth, setState, getStateFromField ])

  useFieldListener(field, onFieldChange)

  const setMonth = useCallback((count: number) => {
    const nextYearMonth = time(yearMonth, format)
      .add(count, 'month')
      .format(format)

    setState({
      yearMonth: nextYearMonth,
    })
  }, [ yearMonth, time, setState ])

  const weekDays = useMemo(() => {
    return new Array(7)
      .fill(null)
      .map((_, index) => {
        return time().startOf('week').add(index, 'day').format('dd')
      })
  }, [ time ])

  const getCalendarRange = useCallback((yearMonth: string) => {
    const selectedMonth = time(yearMonth, format)
    const startOfMonth = selectedMonth.startOf('month')
    const endOfMonth = selectedMonth.endOf('month')

    const startDiff = weekDays.indexOf(startOfMonth.format('dd'))
    const endDiff = 6 - weekDays.indexOf(endOfMonth.format('dd'))

    const firstDay = startOfMonth.subtract(startDiff, 'day')
    const lastDay = endOfMonth.add(endDiff, 'day')

    return {
      firstDay,
      lastDay,
    }
  }, [ weekDays, time ])

  const monthRange = useMemo(() => {
    return getCalendarRange(yearMonth)
  }, [ yearMonth, getCalendarRange ])

  const initialMonthRange = useMemo(() => {
    return getCalendarRange(initialYearMonth)
  }, [ initialYearMonth, getCalendarRange ])

  const getDays = useCallback(({ firstDay, lastDay }: GetCalendarRangeInput) => {
    return new Array(lastDay.diff(firstDay, 'day') + 1)
      .fill(null)
      .map((_, index) => {
        const day = firstDay.add(index, 'day')
        const fullDate = day.format('YYYY-MM-DD')
        const [ yearMonth, date ] = day.format('YYYY-MM D').split(' ')

        return {
          date,
          fullDate,
          yearMonth,
        }
      })
  }, [])

  const days = useMemo(() => {
    const daysDiff = monthRange.firstDay.diff(initialMonthRange.firstDay, 'day')

    const firstDay = daysDiff > 0
      ? initialMonthRange.firstDay
      : monthRange.firstDay

    const lastDay = daysDiff > 0
      ? monthRange.lastDay
      : initialMonthRange.lastDay

    return getDays({ firstDay, lastDay })
  }, [ monthRange, initialMonthRange, getDays ])

  const weeksCount = useMemo(() => {
    return monthRange.lastDay.diff(monthRange.firstDay, 'week') + 1
  }, [ monthRange ])

  const weeksOffset = useMemo(() => {
    return initialMonthRange.firstDay.diff(monthRange.firstDay, 'week')
  }, [ monthRange, initialMonthRange ])

  const title = useMemo(() => time(yearMonth, format).format('MMMM, YYYY'), [ yearMonth, time ])

  const isLocaleFetching = useMemo(() => locale !== time().locale(), [ time, locale ])

  useChangeEffect<[ string, number ]>(() => {
    const timeout = setTimeout(() => {
      setState({ initialYearMonth: yearMonth })
    }, animationDuration)

    return () => {
      clearTimeout(timeout)
    }
  }, [ yearMonth, animationDuration ])

  return useMemo(() => ({
    days,
    title,
    weekDays,
    yearMonth,
    weeksCount,
    weeksOffset,
    isLocaleFetching,
    setMonth,
  }), [
    days,
    title,
    weekDays,
    yearMonth,
    weeksCount,
    weeksOffset,
    isLocaleFetching,
    setMonth,
  ])
}


export default useDays
