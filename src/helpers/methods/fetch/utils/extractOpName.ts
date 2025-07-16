const extractOpName = (body?: BodyInit | null): string => {
  if (typeof body !== 'string') {
    return ''
  }

  try {
    const { query } = JSON.parse(body) as { query?: string }

    if (!query) {
      return ''
    }

    const matchArray = query.match(/\b(?:query|mutation)\s+([A-Za-z_]\w*)/)

    return matchArray ? matchArray[1] : ''
  } catch {
    return ''
  }
}


export default extractOpName
