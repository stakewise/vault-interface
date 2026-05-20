import date from 'modules/date'


const getDate = (dateString?: string) => {
  if (!dateString) {
    return null
  }

  let result = date.time(dateString)

  if (result.isValid()) {
    return result
  }
  else {
    result = date.time(dateString, 'YYYY-MM-DD')
  }

  return result.isValid() ? result : null
}


export default getDate
