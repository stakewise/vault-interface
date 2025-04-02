import date from 'modules/date'


const formatDateToNumerical = (value: string | number | Date | ReturnType<Date.Time>, separator: string = '-') => {
  let dayjsDate

  if (typeof value === 'string') {
    if (/^\d+$/.test(value)) {
      dayjsDate = date.time(parseInt(value, 10)) // Unix timestamp
    }
    else {
      dayjsDate = date.time(value)
    }
  }
  else {
    dayjsDate = date.time(value)
  }

  return dayjsDate.format(`YYYY${separator}MM${separator}DD`)
}


export default formatDateToNumerical
