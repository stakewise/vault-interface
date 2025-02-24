import { useMemo } from 'react'


const pagesInRow = 5

const usePages = ({ page, total }: { page: number, total: number }) => {
  return useMemo(() => {
    const isSmall = pagesInRow > total
    const arrLength = isSmall ? total : pagesInRow

    return Array.from({ length: arrLength }, (_, index) => {
      if (isSmall) {
        return index + 1
      }

      const inCenter = page > 2
      const inLasts = page > (total - 2)

      if (inCenter && !inLasts) {
        return index + page - 2
      }

      if (inLasts) {
        const nextRest = total - page + 1
        const shift = pagesInRow - nextRest

        return index + page - shift
      }

      return index + 1
    })
  }, [ page, total ])
}

export default usePages
