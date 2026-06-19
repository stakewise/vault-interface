import { useCallback, useMemo } from 'react'
import intl from 'modules/intl'
import date from 'modules/date'
import { useFieldListener, useObjectState } from 'hooks'


const format = 'YYYY-MM'

const weeksInGrid = 6

type GetCalendarRangeInput = {
  firstDay: Date.Time
  lastDay: Date.Time
}

type Input = {
  field: Forms.Field<string>
}

const useDays = ({ field }: Input) => {
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

  const getYearMonthFromField = useCallback((initialDate?: string) => {
    const { year, month } = parseFieldDate()

    let currentDate = initialDate ? time(initialDate, format) : time()

    if (year) {
      currentDate = currentDate.set('year', year)
    }
    if (month) {
      // in day js months are zero-based
      currentDate = currentDate.set('month', month - 1)
    }

    return currentDate.format(format)
  }, [ time, parseFieldDate ])

  const [ { yearMonth }, setState ] = useObjectState({ yearMonth: getYearMonthFromField() })

  const onFieldChange = useCallback(() => {
    setState({ yearMonth: getYearMonthFromField(yearMonth) })
  }, [ yearMonth, setState, getYearMonthFromField ])

  useFieldListener(field, onFieldChange)

  const setMonth = useCallback((count: number) => {
    const nextYearMonth = time(yearMonth, format)
      .add(count, 'month')
      .format(format)

    setState({
      yearMonth: nextYearMonth,
    })
  }, [ yearMonth, time, setState ])

  const setYear = useCallback((count: number) => {
    const nextYearMonth = time(yearMonth, format)
      .add(count, 'year')
      .format(format)

    setState({
      yearMonth: nextYearMonth,
    })
  }, [ yearMonth, time, setState ])

  const selectMonth = useCallback((month: number) => {
    setState({
      yearMonth: time(yearMonth, format).set('month', month).format(format),
    })
  }, [ yearMonth, time, setState ])

  const selectYear = useCallback((value: number) => {
    setState({
      yearMonth: time(yearMonth, format).set('year', value).format(format),
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
    const startOfMonth = time(yearMonth, format).startOf('month')
    const startDiff = weekDays.indexOf(startOfMonth.format('dd'))

    const firstDay = startOfMonth.subtract(startDiff, 'day')
    const lastDay = firstDay.add(weeksInGrid * 7 - 1, 'day')

    return {
      firstDay,
      lastDay,
    }
  }, [ weekDays, time ])

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
    return getDays(getCalendarRange(yearMonth))
  }, [ yearMonth, getCalendarRange, getDays ])

  const title = useMemo(() => time(yearMonth, format).format('MMMM, YYYY'), [ yearMonth, time ])

  const current = useMemo(() => time(yearMonth, format), [ yearMonth, time ])

  const year = useMemo(() => current.year(), [ current ])

  const decadeStart = useMemo(() => Math.floor(year / 10) * 10, [ year ])

  const months = useMemo(() => (
    new Array(12).fill(null).map((_, index) => ({
      month: index,
      title: current.set('month', index).format('MMM'),
    }))
  ), [ current ])

  const years = useMemo(() => (
    new Array(12).fill(null).map((_, index) => decadeStart - 1 + index)
  ), [ decadeStart ])

  const yearTitle = useMemo(() => String(year), [ year ])

  const decadeTitle = useMemo(() => `${decadeStart} – ${decadeStart + 9}`, [ decadeStart ])

  const isLocaleFetching = useMemo(() => locale !== time().locale(), [ time, locale ])

  return useMemo(() => ({
    days,
    year,
    title,
    years,
    months,
    weekDays,
    yearTitle,
    yearMonth,
    decadeStart,
    decadeTitle,
    isLocaleFetching,
    setYear,
    setMonth,
    selectYear,
    selectMonth,
  }), [
    year,
    days,
    title,
    years,
    months,
    weekDays,
    yearMonth,
    yearTitle,
    decadeStart,
    decadeTitle,
    isLocaleFetching,
    setYear,
    setMonth,
    selectYear,
    selectMonth,
  ])
}


export default useDays
