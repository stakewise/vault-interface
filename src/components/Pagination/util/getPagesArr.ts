const pagesInRow = 5

const getPagesArr = (currentPage: number, maxPages: number) => {
  const isSmall = pagesInRow > maxPages
  const arrLength = isSmall ? maxPages : pagesInRow

  return Array.from({ length: arrLength }, (_, index) => {
    if (isSmall) {
      return index + 1
    }

    const inCenter = currentPage > 2
    const inLasts = currentPage > (maxPages - 2)

    if (inCenter && !inLasts) {
      return index + currentPage - 2
    }

    if (inLasts) {
      const nextRest = maxPages - currentPage + 1
      const shift = pagesInRow - nextRest

      return index + currentPage - shift
    }

    return index + 1
  })
}

export default getPagesArr
