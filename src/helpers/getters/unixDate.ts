import date from 'sw-modules/date'


const day = 24 * 60 * 60

const getStartOfDay = () => {
  const utcOffset = date.time().utcOffset()

  return date.time()
    .startOf('day')
    .add(utcOffset, 'minutes')
}

const getUnixStartOfDay = () => getStartOfDay().unix()

const getUnixStartOfDayOffset = (daysOffset: number): number => {
  const startOfDay = getStartOfDay()
  const offsetDay = startOfDay.subtract(day * daysOffset, 'seconds')

  return offsetDay.unix()
}


export {
  getUnixStartOfDay,
  getUnixStartOfDayOffset,
}
