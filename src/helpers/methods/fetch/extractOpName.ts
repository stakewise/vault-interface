const extractOpName = (body?: BodyInit | null): string => {
  if (typeof body !== 'string') {
    return ''
  }

  try {
    const { query } = JSON.parse(body) as { query?: string }

    if (!query) {
      return ''
    }

    const m = query.match(/^\s*(?:query|mutation)\s+([_A-Za-z][_0-9A-Za-z]*)/m)

    return m ? m[1] : ''
  } catch {
    return ''
  }
}


export default extractOpName
